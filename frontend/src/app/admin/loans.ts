import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { HopDong } from '../core/models';
import { TienPipe, nhanTrangThai } from '../core/util';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [RouterLink, TienPipe, DatePipe],
  template: `
    <h1 class="page-title">Hồ sơ vay</h1>
    <p class="page-sub">Khởi tạo, xét duyệt và theo dõi quy trình hồ sơ vay.</p>

    <div class="flex gap-8 wrap" style="margin-bottom:16px">
      @for (f of boLoc; track f.value) {
        <button class="btn btn-sm" [class.btn-primary]="locHienTai() === f.value"
                [class.btn-ghost]="locHienTai() !== f.value" (click)="locHienTai.set(f.value)">
          {{ f.label }}
        </button>
      }
    </div>

    <div class="card table-wrap">
      <table class="tbl">
        <thead>
          <tr><th>Mã</th><th>Khách hàng</th><th>Hạn mức</th><th>Kỳ hạn</th><th>Lãi suất</th>
              <th>Dư nợ</th><th>Ngày tạo</th><th>Trạng thái</th><th></th></tr>
        </thead>
        <tbody>
          @for (h of locDanhSach(); track h.id) {
            <tr class="clickable" [routerLink]="['/quan-tri/ho-so-vay', h.id]">
              <td>#{{ h.id }}</td>
              <td style="font-weight:600">{{ h.tenKhachHang }}</td>
              <td class="mono-num">{{ h.hanMuc | tien }}</td>
              <td>{{ h.kyHanThang }} tháng</td>
              <td>{{ h.laiSuat }}%</td>
              <td class="mono-num">{{ h.duNoConLai | tien }}</td>
              <td>{{ h.ngayTao | date:'dd/MM/yyyy' }}</td>
              <td><span class="badge" [class]="nhanTT(h.trangThai).cls">{{ nhanTT(h.trangThai).text }}</span></td>
              <td><a [routerLink]="['/quan-tri/ho-so-vay', h.id]" style="font-size:13px">Xem →</a></td>
            </tr>
          } @empty {
            <tr><td colspan="9"><div class="empty">Không có hồ sơ nào.</div></td></tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class LoansComponent implements OnInit {
  ds = signal<HopDong[]>([]);
  locHienTai = signal('all');
  nhanTT = nhanTrangThai;

  boLoc = [
    { value: 'all', label: 'Tất cả' },
    { value: 'ChoDuyet', label: 'Chờ duyệt' },
    { value: 'DangVay', label: 'Đang vay' },
    { value: 'DaGiaiNgan', label: 'Đã giải ngân' },
    { value: 'TatToan', label: 'Tất toán' },
    { value: 'TuChoi', label: 'Từ chối' }
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.dsHopDong().subscribe(d => this.ds.set(d));
  }

  locDanhSach(): HopDong[] {
    const f = this.locHienTai();
    return f === 'all' ? this.ds() : this.ds().filter(h => h.trangThai === f);
  }
}
