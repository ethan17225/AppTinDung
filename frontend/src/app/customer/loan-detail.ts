import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { HopDongChiTiet } from '../core/models';
import { TienPipe, nhanTrangThai } from '../core/util';

@Component({
  selector: 'app-customer-loan-detail',
  standalone: true,
  imports: [TienPipe, DatePipe],
  template: `
    <span class="link-back" (click)="quayLai()">← Khoản vay của tôi</span>

    @if (hd(); as h) {
      <div class="section-head">
        <div>
          <h1 class="page-title">Khoản vay #{{ h.id }}</h1>
          <p class="muted" style="margin:0">{{ h.mucDich || 'Khoản vay tín dụng' }}</p>
        </div>
        <span class="badge" [class]="nhanTT(h.trangThai).cls" style="font-size:13px;padding:6px 14px">
          {{ nhanTT(h.trangThai).text }}
        </span>
      </div>

      @if (thongBao()) { <div class="alert alert-ok">{{ thongBao() }}</div> }

      <div class="stat-grid" style="margin-bottom:18px">
        <div class="stat"><div class="label">Hạn mức</div><div class="value sm mono-num">{{ h.hanMuc | tien }}</div></div>
        <div class="stat"><div class="label">Dư nợ còn lại</div><div class="value sm mono-num">{{ h.duNoConLai | tien }}</div></div>
        <div class="stat"><div class="label">Lãi suất</div><div class="value">{{ h.laiSuat }}%</div><div class="foot">mỗi năm</div></div>
        <div class="stat"><div class="label">Kỳ hạn</div><div class="value">{{ h.kyHanThang }}</div><div class="foot">tháng</div></div>
      </div>

      @if (h.trangThai === 'ChoDuyet') {
        <div class="alert alert-info">Hồ sơ của bạn đang chờ nhân viên tín dụng xét duyệt.</div>
      }

      @if (h.lichTra.length > 0) {
        <div class="card card-pad">
          <h3 style="font-size:16px;margin-bottom:12px">Lịch thanh toán</h3>
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
                      @if (l.daThanhToan) { <span class="badge badge-ok">Đã thanh toán</span> }
                      @else { <span class="badge badge-neutral">Chưa thanh toán</span> }
                    </td>
                    <td>
                      @if (!l.daThanhToan) {
                        <button class="btn btn-primary btn-sm" (click)="thanhToan(l.id)" [disabled]="dangTra()">Thanh toán</button>
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

    <!-- Bien lai dien tu -->
    @if (bienLai(); as b) {
      <div class="overlay" (click)="bienLai.set(null)">
        <div class="receipt" (click)="$event.stopPropagation()">
          <div class="receipt-head">
            <div class="brand-logo"><span class="dot">T</span> App Tín Dụng</div>
            <span class="badge badge-ok">Thành công</span>
          </div>
          <h3 style="text-align:center;margin:8px 0 4px">Biên lai điện tử</h3>
          <p class="faint" style="text-align:center;font-size:12.5px;margin:0 0 16px">{{ b.maGiaoDich }}</p>
          <div class="kv"><span class="k">Khách hàng</span><span class="v">{{ b.tenKhachHang }}</span></div>
          <div class="kv"><span class="k">Hợp đồng</span><span class="v">#{{ b.hopDongId }} · Kỳ {{ b.kyThu }}</span></div>
          <div class="kv"><span class="k">Thời gian</span><span class="v">{{ b.thoiGian | date:'dd/MM/yyyy HH:mm' }}</span></div>
          <div class="kv"><span class="k">Dư nợ còn lại</span><span class="v mono-num">{{ b.duNoConLai | tien }}</span></div>
          <div class="kv" style="font-size:17px"><span class="k">Số tiền</span><span class="v mono-num" style="color:var(--brand)">{{ b.soTien | tien }}</span></div>
          <button class="btn btn-primary btn-block" style="margin-top:16px" (click)="bienLai.set(null)">Đóng</button>
        </div>
      </div>
    }
  `,
  styles: [`
    .overlay { position: fixed; inset: 0; background: rgba(28,27,24,.5); display: grid; place-items: center; padding: 20px; z-index: 50; }
    .receipt { background: var(--surface); border-radius: 16px; padding: 26px; width: 100%; max-width: 380px; box-shadow: var(--shadow); }
    .receipt-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .brand-logo { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-weight: 800; font-size: 15px; }
    .brand-logo .dot { width: 26px; height: 26px; border-radius: 8px; background: var(--brand); color: #fff; display: grid; place-items: center; }
  `]
})
export class CustomerLoanDetailComponent implements OnInit {
  hd = signal<HopDongChiTiet | null>(null);
  bienLai = signal<any | null>(null);
  thongBao = signal('');
  dangTra = signal(false);
  id = 0;
  nhanTT = nhanTrangThai;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.tai();
  }
  tai() { this.api.chiTietHopDong(this.id).subscribe(h => this.hd.set(h)); }

  thanhToan(lichTraId: number) {
    this.dangTra.set(true);
    this.api.thanhToan(lichTraId).subscribe({
      next: kq => {
        this.dangTra.set(false);
        this.bienLai.set(kq.bienLai);
        this.thongBao.set('Thanh toán thành công!');
        this.tai();
      },
      error: () => this.dangTra.set(false)
    });
  }

  quayLai() { this.router.navigate(['/portal/khoan-vay']); }
}
