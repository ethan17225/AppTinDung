import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { AuditLog } from '../core/models';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [DatePipe],
  template: `
    <h1 class="page-title">Nhật ký hệ thống</h1>
    <p class="page-sub">Lưu vết các thao tác để phục vụ kiểm toán (Audit Log).</p>

    <div class="card table-wrap">
      <table class="tbl">
        <thead><tr><th>Thời gian</th><th>Người thực hiện</th><th>Hành động</th><th>Đối tượng</th><th>Chi tiết</th></tr></thead>
        <tbody>
          @for (a of ds(); track a.id) {
            <tr>
              <td class="faint" style="white-space:nowrap">{{ a.thoiGian | date:'dd/MM/yyyy HH:mm' }}</td>
              <td style="font-weight:600">{{ a.nguoiThucHien }}</td>
              <td>{{ a.hanhDong }}</td>
              <td>{{ a.doiTuong }}</td>
              <td class="muted">{{ a.chiTiet }}</td>
            </tr>
          } @empty { <tr><td colspan="5"><div class="empty">Chưa có nhật ký.</div></td></tr> }
        </tbody>
      </table>
    </div>
  `
})
export class AuditLogComponent implements OnInit {
  ds = signal<AuditLog[]>([]);
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.auditLog().subscribe(d => this.ds.set(d)); }
}
