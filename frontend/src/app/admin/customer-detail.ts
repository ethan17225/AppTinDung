import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { KhachHang, LichSuCIC, HopDong } from '../core/models';
import { TienPipe, nhanNhomNo, nhanTrangThai } from '../core/util';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, TienPipe, DatePipe],
  template: `
    <span class="link-back" (click)="quayLai()">← Danh sách khách hàng</span>

    @if (kh(); as k) {
      <div class="section-head">
        <div>
          <h1 class="page-title">{{ k.hoTen }}</h1>
          <p class="muted" style="margin:0">{{ k.email }} · {{ k.sdt }}</p>
        </div>
        <button class="btn btn-primary" (click)="moTaoVay.set(!moTaoVay())">＋ Tạo hồ sơ vay</button>
      </div>

      @if (thongBao()) { <div class="alert alert-ok">{{ thongBao() }}</div> }

      @if (moTaoVay()) {
        <div class="card card-pad" style="margin-bottom:18px">
          <h3 style="font-size:16px;margin-bottom:14px">Tạo hồ sơ vay mới</h3>
          <div class="flex gap-12 wrap">
            <div class="field grow"><label>Hạn mức (đ)</label><input class="input" type="number" [(ngModel)]="vay.hanMuc"></div>
            <div class="field grow"><label>Kỳ hạn (tháng)</label><input class="input" type="number" [(ngModel)]="vay.kyHanThang"></div>
            <div class="field grow"><label>Lãi suất (%/năm)</label><input class="input" type="number" [(ngModel)]="vay.laiSuat"></div>
          </div>
          <div class="field"><label>Mục đích vay</label><input class="input" [(ngModel)]="vay.mucDich"></div>
          <button class="btn btn-primary" (click)="taoVay(k.id)" [disabled]="luu()">Lưu hồ sơ</button>
        </div>
      }

      <div class="row-2">
        <div class="card card-pad">
          <h3 style="font-size:16px;margin-bottom:14px">Thông tin định danh (KYC)</h3>
          <div class="field"><label>Họ tên</label><input class="input" [(ngModel)]="form.hoTen"></div>
          <div class="flex gap-12">
            <div class="field grow"><label>SĐT</label><input class="input" [(ngModel)]="form.sdt"></div>
            <div class="field grow"><label>CCCD</label><input class="input" [(ngModel)]="form.cccd"></div>
          </div>
          <div class="field"><label>Email</label><input class="input" [(ngModel)]="form.email"></div>
          <div class="field"><label>Địa chỉ</label><input class="input" [(ngModel)]="form.diaChi"></div>
          <button class="btn btn-ghost" (click)="luuKyc(k.id)">Lưu thông tin</button>
        </div>

        <div>
          <div class="card card-pad flex gap-16 items-center" style="margin-bottom:16px">
            <div class="cic-ring" [style.--val]="phanTramCic(k.diemCIC)" [style.--col]="mauCic(k.diemCIC)">
              <div class="inner"><div class="num">{{ k.diemCIC }}</div><div class="cap">điểm CIC</div></div>
            </div>
            <div>
              <div class="muted" style="font-size:13px;margin-bottom:6px">Phân loại</div>
              <span class="badge" [class]="nhanNhom(k.nhomNo!).cls">{{ k.tenNhomNo }}</span>
            </div>
          </div>

          <div class="card card-pad">
            <h3 style="font-size:16px;margin-bottom:12px">Lịch sử điểm CIC</h3>
            @for (l of lichSu(); track l.id) {
              <div class="kv">
                <span class="k">{{ l.lyDo }}<br><span class="faint" style="font-size:12px">{{ l.thoiGian | date:'dd/MM/yyyy HH:mm' }}</span></span>
                <span class="v" [style.color]="l.diemMoi >= l.diemCu ? 'var(--ok)' : 'var(--danger)'">
                  {{ l.diemCu }} → {{ l.diemMoi }}
                </span>
              </div>
            } @empty { <div class="empty">Chưa có biến động.</div> }
          </div>
        </div>
      </div>

      <div class="card card-pad" style="margin-top:16px">
        <h3 style="font-size:16px;margin-bottom:12px">Hồ sơ vay của khách hàng</h3>
        <table class="tbl">
          <thead><tr><th>Mã HĐ</th><th>Hạn mức</th><th>Kỳ hạn</th><th>Dư nợ</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            @for (h of hopDongs(); track h.id) {
              <tr>
                <td>#{{ h.id }}</td>
                <td class="mono-num">{{ h.hanMuc | tien }}</td>
                <td>{{ h.kyHanThang }} tháng</td>
                <td class="mono-num">{{ h.duNoConLai | tien }}</td>
                <td><span class="badge" [class]="nhanTT(h.trangThai).cls">{{ nhanTT(h.trangThai).text }}</span></td>
                <td><a [routerLink]="['/quan-tri/ho-so-vay', h.id]" style="font-size:13px">Xem →</a></td>
              </tr>
            } @empty { <tr><td colspan="6"><div class="empty">Chưa có hồ sơ vay.</div></td></tr> }
          </tbody>
        </table>
      </div>
    }
  `
})
export class CustomerDetailComponent implements OnInit {
  kh = signal<KhachHang | null>(null);
  lichSu = signal<LichSuCIC[]>([]);
  hopDongs = signal<HopDong[]>([]);
  moTaoVay = signal(false);
  luu = signal(false);
  thongBao = signal('');
  id = 0;

  form = { hoTen: '', email: '', sdt: '', diaChi: '', cccd: '' };
  vay = { hanMuc: 10000000, kyHanThang: 12, laiSuat: 12, mucDich: '' };

  nhanNhom = nhanNhomNo;
  nhanTT = nhanTrangThai;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.taiDuLieu();
  }

  taiDuLieu() {
    this.api.chiTietKhachHang(this.id).subscribe(k => {
      this.kh.set(k);
      this.form = { hoTen: k.hoTen, email: k.email, sdt: k.sdt, diaChi: k.diaChi, cccd: k.cccd };
    });
    this.api.lichSuCic(this.id).subscribe(l => this.lichSu.set(l));
    this.api.dsHopDong().subscribe(d => this.hopDongs.set(d.filter(h => h.khachHangId === this.id)));
  }

  luuKyc(id: number) {
    this.api.capNhatKhachHang(id, this.form).subscribe(() => {
      this.thongBao.set('Đã cập nhật thông tin khách hàng');
      this.taiDuLieu();
    });
  }

  taoVay(khId: number) {
    this.luu.set(true);
    this.api.taoHopDong({ khachHangId: khId, ...this.vay }).subscribe({
      next: () => {
        this.luu.set(false);
        this.moTaoVay.set(false);
        this.thongBao.set('Đã tạo hồ sơ vay (chờ duyệt)');
        this.taiDuLieu();
      },
      error: () => this.luu.set(false)
    });
  }

  quayLai() { this.router.navigate(['/quan-tri/khach-hang']); }
  phanTramCic(d: number) { return Math.round(((d - 300) / 400) * 100); }
  mauCic(d: number) { return d >= 670 ? 'var(--ok)' : d >= 600 ? 'var(--warn)' : 'var(--danger)'; }
}
