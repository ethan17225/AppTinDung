import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { TongQuan, NhomNoThongKe, CanhBaoNo } from '../core/models';
import { TienPipe, nhanNhomNo } from '../core/util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, TienPipe],
  template: `
    <h1 class="page-title">Tổng quan</h1>
    <p class="page-sub">Bảng điều khiển hoạt động tín dụng của hệ thống.</p>

    @if (tq(); as t) {
      <div class="stat-grid">
        <div class="stat">
          <div class="label">Tổng dư nợ</div>
          <div class="value sm mono-num">{{ t.tongDuNo | tien }}</div>
          <div class="foot">{{ t.soHopDongDangVay }} hợp đồng đang vay</div>
        </div>
        <div class="stat">
          <div class="label">Tỷ lệ nợ xấu</div>
          <div class="value" [style.color]="t.tyLeNoXau > 5 ? 'var(--danger)' : 'var(--ok)'">{{ t.tyLeNoXau }}%</div>
          <div class="foot">Nhóm 5 - nợ có khả năng mất vốn</div>
        </div>
        <div class="stat">
          <div class="label">Hợp đồng mới (tháng này)</div>
          <div class="value">{{ t.soHopDongMoiThangNay }}</div>
          <div class="foot">Tổng {{ t.tongSoHopDong }} hợp đồng</div>
        </div>
        <div class="stat">
          <div class="label">Khách hàng</div>
          <div class="value">{{ t.soKhachHang }}</div>
          <div class="foot">{{ t.soHopDongChoDuyet }} hồ sơ chờ duyệt</div>
        </div>
      </div>

      <div class="row-2" style="margin-top:22px">
        <div class="card card-pad">
          <div class="section-head">
            <h3 style="font-size:17px">Phân loại nhóm nợ</h3>
          </div>
          @for (n of nhomNo(); track n.nhom) {
            <div style="margin-bottom:14px">
              <div class="flex between" style="font-size:13.5px;margin-bottom:5px">
                <span>{{ nhanNhom(n.nhom).text }}</span>
                <span class="muted">{{ n.soLuong }} KH</span>
              </div>
              <div class="bar">
                <span [style.width.%]="tyLe(n.soLuong)" [style.background]="mauNhom(n.nhom)"></span>
              </div>
            </div>
          }
        </div>

        <div class="card card-pad">
          <div class="section-head">
            <h3 style="font-size:17px">Cảnh báo thu hồi nợ</h3>
            <a routerLink="/quan-tri/thu-hoi-no" style="font-size:13px">Xem tất cả →</a>
          </div>
          @if (canhBao().length === 0) {
            <div class="empty">Không có khoản nợ nào sắp/quá hạn.</div>
          } @else {
            <table class="tbl">
              <thead><tr><th>Khách hàng</th><th>Kỳ</th><th>Số tiền</th><th>Trạng thái</th></tr></thead>
              <tbody>
                @for (c of canhBao().slice(0, 6); track c.id) {
                  <tr>
                    <td>{{ c.tenKhachHang }}</td>
                    <td>Kỳ {{ c.kyThu }}</td>
                    <td class="mono-num">{{ c.soTien | tien }}</td>
                    <td>
                      @if (c.quaHan) { <span class="badge badge-danger">Quá hạn {{ c.soNgayTre }} ngày</span> }
                      @else { <span class="badge badge-warn">Sắp đến hạn</span> }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    } @else {
      <div class="empty">Đang tải dữ liệu...</div>
    }
  `
})
export class DashboardComponent implements OnInit {
  tq = signal<TongQuan | null>(null);
  nhomNo = signal<NhomNoThongKe[]>([]);
  canhBao = signal<CanhBaoNo[]>([]);
  nhanNhom = nhanNhomNo;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.tongQuan().subscribe(t => this.tq.set(t));
    this.api.phanLoaiNhomNo().subscribe(n => this.nhomNo.set(n));
    this.api.canhBaoNo().subscribe(c => this.canhBao.set(c));
  }

  tyLe(soLuong: number): number {
    const tong = this.nhomNo().reduce((s, n) => s + n.soLuong, 0);
    return tong > 0 ? Math.round((soLuong / tong) * 100) : 0;
  }

  mauNhom(nhom: number): string {
    if (nhom <= 2) return 'var(--ok)';
    if (nhom <= 4) return 'var(--warn)';
    return 'var(--danger)';
  }
}
