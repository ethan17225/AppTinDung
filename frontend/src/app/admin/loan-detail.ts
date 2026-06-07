import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { HopDongChiTiet } from '../core/models';
import { TienPipe, nhanTrangThai } from '../core/util';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [TienPipe, DatePipe],
  template: `
    <span class="link-back" (click)="quayLai()">← Danh sách hồ sơ vay</span>

    @if (hd(); as h) {
      <div class="section-head">
        <div>
          <h1 class="page-title">Hồ sơ vay #{{ h.id }}</h1>
          <p class="muted" style="margin:0">Khách hàng: <b>{{ h.tenKhachHang }}</b></p>
        </div>
        <span class="badge" [class]="nhanTT(h.trangThai).cls" style="font-size:13px;padding:6px 14px">
          {{ nhanTT(h.trangThai).text }}
        </span>
      </div>

      @if (thongBao()) { <div class="alert alert-ok">{{ thongBao() }}</div> }

      <!-- Quy trinh workflow -->
      <div class="card card-pad" style="margin-bottom:16px">
        <div class="flex between items-center wrap gap-12">
          <div class="flex gap-8 items-center wrap">
            @for (b of cacBuoc; track b.key; let i = $index) {
              <div class="flex items-center gap-8">
                <span class="badge" [class]="trangThaiBuoc(b.key) ? 'badge-ok' : 'badge-neutral'">
                  {{ trangThaiBuoc(b.key) ? '✓' : (i + 1) }} {{ b.label }}
                </span>
                @if (i < cacBuoc.length - 1) { <span class="faint">→</span> }
              </div>
            }
          </div>
          @if (h.trangThai === 'ChoDuyet') {
            <div class="flex gap-8">
              <button class="btn btn-ok btn-sm" (click)="duyet(h.id)">Duyệt & giải ngân</button>
              <button class="btn btn-danger btn-sm" (click)="tuChoi(h.id)">Từ chối</button>
            </div>
          }
        </div>
      </div>

      <div class="row-2">
        <div class="card card-pad">
          <h3 style="font-size:16px;margin-bottom:12px">Thông tin hợp đồng</h3>
          <div class="kv"><span class="k">Hạn mức giải ngân</span><span class="v mono-num">{{ h.hanMuc | tien }}</span></div>
          <div class="kv"><span class="k">Kỳ hạn</span><span class="v">{{ h.kyHanThang }} tháng</span></div>
          <div class="kv"><span class="k">Lãi suất</span><span class="v">{{ h.laiSuat }}% / năm</span></div>
          <div class="kv"><span class="k">Mục đích</span><span class="v">{{ h.mucDich || '—' }}</span></div>
          <div class="kv"><span class="k">Dư nợ còn lại</span><span class="v mono-num">{{ h.duNoConLai | tien }}</span></div>
          <div class="kv"><span class="k">Ngày tạo</span><span class="v">{{ h.ngayTao | date:'dd/MM/yyyy' }}</span></div>
          <div class="kv"><span class="k">Ngày giải ngân</span><span class="v">{{ h.ngayGiaiNgan ? (h.ngayGiaiNgan | date:'dd/MM/yyyy') : '—' }}</span></div>
        </div>

        <div class="card card-pad">
          <h3 style="font-size:16px;margin-bottom:12px">Dòng tiền giao dịch</h3>
          @if (h.giaoDich.length === 0) { <div class="empty">Chưa có giao dịch.</div> }
          @for (g of h.giaoDich; track g.id) {
            <div class="kv">
              <span class="k">
                {{ g.loaiGiaoDich === 'GiaiNgan' ? 'Giải ngân' : 'Thu nợ' }}<br>
                <span class="faint" style="font-size:12px">{{ g.thoiGian | date:'dd/MM/yyyy HH:mm' }}</span>
              </span>
              <span class="v mono-num" [style.color]="g.loaiGiaoDich === 'GiaiNgan' ? 'var(--danger)' : 'var(--ok)'">
                {{ g.loaiGiaoDich === 'GiaiNgan' ? '−' : '+' }}{{ g.soTien | tien }}
              </span>
            </div>
          }
        </div>
      </div>

      <!-- Lich tra -->
      @if (h.lichTra.length > 0) {
        <div class="card card-pad" style="margin-top:16px">
          <h3 style="font-size:16px;margin-bottom:12px">Lịch trả nợ</h3>
          <div class="table-wrap">
            <table class="tbl">
              <thead><tr><th>Kỳ</th><th>Đến hạn</th><th>Gốc</th><th>Lãi</th><th>Tổng kỳ</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                @for (l of h.lichTra; track l.id) {
                  <tr>
                    <td>Kỳ {{ l.kyThu }}</td>
                    <td>{{ l.ngayDenHan | date:'dd/MM/yyyy' }}</td>
                    <td class="mono-num">{{ l.soTienGoc | tien }}</td>
                    <td class="mono-num">{{ l.soTienLai | tien }}</td>
                    <td class="mono-num" style="font-weight:600">{{ l.tongKy | tien }}</td>
                    <td>
                      @if (l.daThanhToan) { <span class="badge badge-ok">Đã thu</span> }
                      @else { <span class="badge badge-neutral">Chưa thu</span> }
                    </td>
                    <td>
                      @if (!l.daThanhToan && h.trangThai !== 'ChoDuyet' && h.trangThai !== 'TuChoi') {
                        <button class="btn btn-ok btn-sm" (click)="thuNo(l.id)">Ghi nhận thu</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    }
  `
})
export class LoanDetailComponent implements OnInit {
  hd = signal<HopDongChiTiet | null>(null);
  thongBao = signal('');
  id = 0;
  nhanTT = nhanTrangThai;

  cacBuoc = [
    { key: 'ChoDuyet', label: 'Chờ duyệt' },
    { key: 'DaGiaiNgan', label: 'Đã giải ngân' },
    { key: 'DangVay', label: 'Đang vay' },
    { key: 'TatToan', label: 'Tất toán' }
  ];

  constructor(private api: ApiService, public auth: AuthService,
              private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.tai();
  }

  tai() { this.api.chiTietHopDong(this.id).subscribe(h => this.hd.set(h)); }

  // Xac dinh buoc da hoan thanh dua vao trang thai hien tai
  trangThaiBuoc(key: string): boolean {
    const tt = this.hd()?.trangThai;
    const thuTu: Record<string, number> = { ChoDuyet: 0, DaGiaiNgan: 1, DangVay: 2, TatToan: 3 };
    if (!tt || tt === 'TuChoi') return false;
    return thuTu[tt] >= thuTu[key];
  }

  duyet(id: number) {
    this.api.duyetHopDong(id).subscribe(() => { this.thongBao.set('Đã duyệt và giải ngân hồ sơ'); this.tai(); });
  }
  tuChoi(id: number) {
    this.api.tuChoiHopDong(id).subscribe(() => { this.thongBao.set('Đã từ chối hồ sơ'); this.tai(); });
  }
  thuNo(lichTraId: number) {
    this.api.thanhToan(lichTraId).subscribe(() => { this.thongBao.set('Đã ghi nhận khoản thu'); this.tai(); });
  }

  quayLai() { this.router.navigate(['/quan-tri/ho-so-vay']); }
}
