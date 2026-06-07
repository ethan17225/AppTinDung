import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { HopDong } from '../core/models';
import { TienPipe, nhanTrangThai } from '../core/util';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [RouterLink, TienPipe, DatePipe],
  template: `
    <div class="section-head">
      <div>
        <h1 class="page-title">Khoản vay của tôi</h1>
        <p class="muted" style="margin:0">Theo dõi dư nợ, lãi suất và lịch thanh toán.</p>
      </div>
      <a class="btn btn-primary" routerLink="/portal/dang-ky-vay">＋ Đăng ký vay mới</a>
    </div>

    <div class="card table-wrap">
      <table class="tbl">
        <thead><tr><th>Mã</th><th>Hạn mức</th><th>Kỳ hạn</th><th>Lãi suất</th><th>Dư nợ</th><th>Ngày tạo</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          @for (h of ds(); track h.id) {
            <tr class="clickable" [routerLink]="['/portal/khoan-vay', h.id]">
              <td>#{{ h.id }}</td>
              <td class="mono-num">{{ h.hanMuc | tien }}</td>
              <td>{{ h.kyHanThang }} tháng</td>
              <td>{{ h.laiSuat }}%</td>
              <td class="mono-num">{{ h.duNoConLai | tien }}</td>
              <td>{{ h.ngayTao | date:'dd/MM/yyyy' }}</td>
              <td><span class="badge" [class]="nhanTT(h.trangThai).cls">{{ nhanTT(h.trangThai).text }}</span></td>
              <td><a [routerLink]="['/portal/khoan-vay', h.id]" style="font-size:13px">Chi tiết →</a></td>
            </tr>
          } @empty { <tr><td colspan="8"><div class="empty">Bạn chưa có khoản vay nào.</div></td></tr> }
        </tbody>
      </table>
    </div>
  `
})
export class MyLoansComponent implements OnInit {
  ds = signal<HopDong[]>([]);
  nhanTT = nhanTrangThai;
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.dsHopDong().subscribe(d => this.ds.set(d)); }
}
