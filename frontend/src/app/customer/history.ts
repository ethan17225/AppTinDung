import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { GiaoDich } from '../core/models';
import { TienPipe } from '../core/util';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [TienPipe, DatePipe],
  template: `
    <h1 class="page-title">Lịch sử giao dịch</h1>
    <p class="page-sub">Toàn bộ biến động thanh toán và giải ngân của bạn.</p>

    <div class="card table-wrap">
      <table class="tbl">
        <thead><tr><th>Thời gian</th><th>Hợp đồng</th><th>Loại</th><th>Nội dung</th><th style="text-align:right">Số tiền</th></tr></thead>
        <tbody>
          @for (g of ds(); track g.id) {
            <tr>
              <td class="faint" style="white-space:nowrap">{{ g.thoiGian | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>#{{ g.hopDongId }}</td>
              <td>
                @if (g.loaiGiaoDich === 'GiaiNgan') { <span class="badge badge-info">Giải ngân</span> }
                @else { <span class="badge badge-ok">Thu nợ</span> }
              </td>
              <td class="muted">{{ g.ghiChu }}</td>
              <td class="mono-num" style="text-align:right;font-weight:600"
                  [style.color]="g.loaiGiaoDich === 'GiaiNgan' ? 'var(--danger)' : 'var(--ok)'">
                {{ g.loaiGiaoDich === 'GiaiNgan' ? '−' : '+' }}{{ g.soTien | tien }}
              </td>
            </tr>
          } @empty { <tr><td colspan="5"><div class="empty">Chưa có giao dịch nào.</div></td></tr> }
        </tbody>
      </table>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  ds = signal<GiaoDich[]>([]);
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.lichSuGiaoDich().subscribe(d => this.ds.set(d)); }
}
