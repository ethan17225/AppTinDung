import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { KhachHang, LichSuCIC, HopDong } from '../core/models';
import { TienPipe, nhanNhomNo, nhanTrangThai } from '../core/util';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, TienPipe, DatePipe],
  template: `
    <h1 class="page-title">Xin chào, {{ auth.user()?.hoTen }}</h1>
    <p class="page-sub">Thông tin cá nhân và tình trạng tín dụng của bạn.</p>

    @if (kh(); as k) {
      <div class="row-2">
        <div class="card card-pad flex gap-16 items-center">
          <div class="cic-ring" [style.--val]="phanTramCic(k.diemCIC)" [style.--col]="mauCic(k.diemCIC)">
            <div class="inner"><div class="num">{{ k.diemCIC }}</div><div class="cap">điểm CIC</div></div>
          </div>
          <div>
            <div class="muted" style="font-size:13px;margin-bottom:6px">Xếp loại tín dụng</div>
            <span class="badge" [class]="nhanNhom(k.nhomNo!).cls">{{ k.tenNhomNo }}</span>
            <p class="faint" style="font-size:12.5px;margin-top:10px;max-width:240px">
              Thanh toán đúng hạn để tăng điểm tín dụng và được hưởng ưu đãi tốt hơn.
            </p>
          </div>
        </div>

        <div class="card card-pad">
          <h3 style="font-size:16px;margin-bottom:12px">Thông tin định danh</h3>
          <div class="kv"><span class="k">Họ tên</span><span class="v">{{ k.hoTen }}</span></div>
          <div class="kv"><span class="k">Email</span><span class="v">{{ k.email }}</span></div>
          <div class="kv"><span class="k">Số điện thoại</span><span class="v">{{ k.sdt }}</span></div>
          <div class="kv"><span class="k">CCCD</span><span class="v">{{ k.cccd }}</span></div>
          <div class="kv"><span class="k">Địa chỉ</span><span class="v">{{ k.diaChi }}</span></div>
        </div>
      </div>

      <div class="card card-pad" style="margin-top:16px">
        <div class="section-head">
          <h3 style="font-size:16px">Khoản vay gần đây</h3>
          <a routerLink="/portal/khoan-vay" style="font-size:13px">Xem tất cả →</a>
        </div>
        <table class="tbl">
          <thead><tr><th>Mã</th><th>Hạn mức</th><th>Dư nợ</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            @for (h of hopDongs().slice(0,5); track h.id) {
              <tr>
                <td>#{{ h.id }}</td>
                <td class="mono-num">{{ h.hanMuc | tien }}</td>
                <td class="mono-num">{{ h.duNoConLai | tien }}</td>
                <td><span class="badge" [class]="nhanTT(h.trangThai).cls">{{ nhanTT(h.trangThai).text }}</span></td>
                <td><a [routerLink]="['/portal/khoan-vay', h.id]" style="font-size:13px">Xem →</a></td>
              </tr>
            } @empty { <tr><td colspan="5"><div class="empty">Bạn chưa có khoản vay nào.</div></td></tr> }
          </tbody>
        </table>
      </div>

      <div class="card card-pad" style="margin-top:16px">
        <h3 style="font-size:16px;margin-bottom:12px">Lịch sử điểm CIC</h3>
        @for (l of lichSu(); track l.id) {
          <div class="kv">
            <span class="k">{{ l.lyDo }}<br><span class="faint" style="font-size:12px">{{ l.thoiGian | date:'dd/MM/yyyy HH:mm' }}</span></span>
            <span class="v" [style.color]="l.diemMoi >= l.diemCu ? 'var(--ok)' : 'var(--danger)'">{{ l.diemCu }} → {{ l.diemMoi }}</span>
          </div>
        } @empty { <div class="empty">Chưa có biến động.</div> }
      </div>
    }
  `
})
export class ProfileComponent implements OnInit {
  kh = signal<KhachHang | null>(null);
  lichSu = signal<LichSuCIC[]>([]);
  hopDongs = signal<HopDong[]>([]);
  nhanNhom = nhanNhomNo;
  nhanTT = nhanTrangThai;

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    const id = this.auth.user()?.khachHangId;
    if (id) {
      this.api.chiTietKhachHang(id).subscribe(k => this.kh.set(k));
      this.api.lichSuCic(id).subscribe(l => this.lichSu.set(l));
    }
    this.api.dsHopDong().subscribe(d => this.hopDongs.set(d));
  }

  phanTramCic(d: number) { return Math.round(((d - 300) / 400) * 100); }
  mauCic(d: number) { return d >= 670 ? 'var(--ok)' : d >= 600 ? 'var(--warn)' : 'var(--danger)'; }
}
