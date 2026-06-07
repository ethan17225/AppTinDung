import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { CanhBaoNo, NhomNoThongKe } from '../core/models';
import { TienPipe, nhanNhomNo } from '../core/util';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [RouterLink, TienPipe, DatePipe],
  template: `
    <div class="section-head">
      <div>
        <h1 class="page-title">Thu hồi nợ</h1>
        <p class="muted" style="margin:0">Cảnh báo nợ đến hạn, phân loại nhóm nợ và cập nhật điểm CIC.</p>
      </div>
      <button class="btn btn-primary" (click)="chayBatch()" [disabled]="dangChay()">
        {{ dangChay() ? 'Đang chạy...' : '▶ Chạy batch cập nhật nợ' }}
      </button>
    </div>

    @if (ketQuaBatch()) { <div class="alert alert-info">{{ ketQuaBatch() }}</div> }

    <div class="stat-grid" style="margin-bottom:22px">
      @for (n of nhomNo(); track n.nhom) {
        <div class="stat">
          <div class="label">{{ nhanNhom(n.nhom).text }}</div>
          <div class="value">{{ n.soLuong }}</div>
          <div class="foot">khách hàng</div>
        </div>
      }
    </div>

    <div class="card card-pad">
      <h3 style="font-size:16px;margin-bottom:14px">Khoản nợ sắp đến hạn / quá hạn</h3>
      <div class="table-wrap">
        <table class="tbl">
          <thead><tr><th>Khách hàng</th><th>Hồ sơ</th><th>Kỳ</th><th>Đến hạn</th><th>Số tiền</th>
                     <th>Số ngày trễ</th><th>Điểm CIC</th><th>Trạng thái</th></tr></thead>
          <tbody>
            @for (c of canhBao(); track c.id) {
              <tr>
                <td style="font-weight:600">{{ c.tenKhachHang }}</td>
                <td><a [routerLink]="['/quan-tri/ho-so-vay', c.hopDongId]">#{{ c.hopDongId }}</a></td>
                <td>Kỳ {{ c.kyThu }}</td>
                <td>{{ c.ngayDenHan | date:'dd/MM/yyyy' }}</td>
                <td class="mono-num">{{ c.soTien | tien }}</td>
                <td class="mono-num">{{ c.soNgayTre }}</td>
                <td class="mono-num">{{ c.diemCIC }}</td>
                <td>
                  @if (c.quaHan) { <span class="badge badge-danger">Quá hạn</span> }
                  @else { <span class="badge badge-warn">Sắp đến hạn</span> }
                </td>
              </tr>
            } @empty { <tr><td colspan="8"><div class="empty">Không có khoản nợ cần cảnh báo.</div></td></tr> }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class CollectionsComponent implements OnInit {
  canhBao = signal<CanhBaoNo[]>([]);
  nhomNo = signal<NhomNoThongKe[]>([]);
  dangChay = signal(false);
  ketQuaBatch = signal('');
  nhanNhom = nhanNhomNo;

  constructor(private api: ApiService) {}

  ngOnInit() { this.tai(); }

  tai() {
    this.api.canhBaoNo().subscribe(c => this.canhBao.set(c));
    this.api.phanLoaiNhomNo().subscribe(n => this.nhomNo.set(n));
  }

  chayBatch() {
    this.dangChay.set(true);
    this.api.chayBatch().subscribe({
      next: kq => {
        this.dangChay.set(false);
        this.ketQuaBatch.set(`${kq.thongBao}: quét ${kq.soKyQuaHan} kỳ quá hạn, trừ điểm ${kq.soLanTruDiem} lần.`);
        this.tai();
      },
      error: () => this.dangChay.set(false)
    });
  }
}
