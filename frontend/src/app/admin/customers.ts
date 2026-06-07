import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { KhachHang } from '../core/models';
import { nhanNhomNo } from '../core/util';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <h1 class="page-title">Khách hàng</h1>
    <p class="page-sub">Quản lý thông tin định danh (KYC) và điểm tín dụng CIC.</p>

    <div class="card">
      <div class="card-pad" style="padding-bottom:14px">
        <input class="input" style="max-width:320px" placeholder="Tìm theo tên, SĐT, CCCD..."
               [(ngModel)]="tuKhoa">
      </div>
      <div class="table-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>Họ tên</th><th>SĐT</th><th>CCCD</th><th>Điểm CIC</th>
              <th>Nhóm nợ</th><th>Số HĐ</th><th></th>
            </tr>
          </thead>
          <tbody>
            @for (k of locDanhSach(); track k.id) {
              <tr class="clickable" [routerLink]="['/quan-tri/khach-hang', k.id]">
                <td>
                  <div style="font-weight:600">{{ k.hoTen }}</div>
                  <div class="faint" style="font-size:12.5px">{{ k.email }}</div>
                </td>
                <td>{{ k.sdt }}</td>
                <td>{{ k.cccd }}</td>
                <td class="mono-num" style="font-weight:600">{{ k.diemCIC }}</td>
                <td><span class="badge" [class]="nhanNhom(k.nhomNo!).cls">Nhóm {{ k.nhomNo }}</span></td>
                <td>{{ k.soHopDong }}</td>
                <td><a [routerLink]="['/quan-tri/khach-hang', k.id]" style="font-size:13px">Chi tiết →</a></td>
              </tr>
            } @empty {
              <tr><td colspan="7"><div class="empty">Chưa có khách hàng nào.</div></td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class CustomersComponent implements OnInit {
  ds = signal<KhachHang[]>([]);
  tuKhoa = '';
  nhanNhom = nhanNhomNo;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.dsKhachHang().subscribe(d => this.ds.set(d));
  }

  locDanhSach(): KhachHang[] {
    const t = this.tuKhoa.trim().toLowerCase();
    if (!t) return this.ds();
    return this.ds().filter(k =>
      k.hoTen.toLowerCase().includes(t) ||
      k.sdt.includes(t) ||
      k.cccd.includes(t) ||
      k.email.toLowerCase().includes(t));
  }
}
