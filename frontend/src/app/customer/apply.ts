import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/api.service';
import { TienPipe } from '../core/util';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [FormsModule, TienPipe],
  template: `
    <h1 class="page-title">Đăng ký vay mới</h1>
    <p class="page-sub">Điền thông tin khoản vay mong muốn. Hồ sơ sẽ được nhân viên tín dụng xét duyệt.</p>

    @if (thanhCong()) {
      <div class="alert alert-ok">{{ thanhCong() }}</div>
    }
    @if (loi()) { <div class="alert alert-error">{{ loi() }}</div> }

    <div class="row-2">
      <div class="card card-pad">
        <div class="field">
          <label>Số tiền muốn vay (đ)</label>
          <input class="input" type="number" [(ngModel)]="form.hanMuc">
        </div>
        <div class="field">
          <label>Kỳ hạn (tháng)</label>
          <select class="select" [(ngModel)]="form.kyHanThang">
            <option [value]="6">6 tháng</option>
            <option [value]="12">12 tháng</option>
            <option [value]="18">18 tháng</option>
            <option [value]="24">24 tháng</option>
            <option [value]="36">36 tháng</option>
          </select>
        </div>
        <div class="field">
          <label>Mục đích vay</label>
          <textarea class="input" rows="3" [(ngModel)]="form.mucDich" placeholder="Ví dụ: mua sắm, kinh doanh, tiêu dùng..."></textarea>
        </div>
        <button class="btn btn-primary btn-block" (click)="guiYeuCau()" [disabled]="dangGui()">
          {{ dangGui() ? 'Đang gửi...' : 'Gửi yêu cầu vay' }}
        </button>
      </div>

      <div class="card card-pad">
        <h3 style="font-size:16px;margin-bottom:12px">Ước tính khoản vay</h3>
        <p class="muted" style="font-size:13.5px">Lãi suất tham khảo: <b>12%/năm</b> (dư nợ giảm dần). Lãi suất chính thức sẽ do nhân viên xác định khi duyệt.</p>
        <div class="kv"><span class="k">Số tiền vay</span><span class="v mono-num">{{ form.hanMuc | tien }}</span></div>
        <div class="kv"><span class="k">Kỳ hạn</span><span class="v">{{ form.kyHanThang }} tháng</span></div>
        <div class="kv"><span class="k">Gốc trả mỗi kỳ</span><span class="v mono-num">{{ gocMoiKy() | tien }}</span></div>
        <div class="kv"><span class="k">Lãi kỳ đầu (ước tính)</span><span class="v mono-num">{{ laiKyDau() | tien }}</span></div>
      </div>
    </div>
  `
})
export class ApplyComponent {
  form = { hanMuc: 10000000, kyHanThang: 12, mucDich: '' };
  dangGui = signal(false);
  thanhCong = signal('');
  loi = signal('');

  constructor(private api: ApiService, private router: Router) {}

  gocMoiKy(): number {
    return this.form.kyHanThang > 0 ? Math.round(this.form.hanMuc / this.form.kyHanThang) : 0;
  }
  laiKyDau(): number {
    return Math.round(this.form.hanMuc * (12 / 100 / 12));
  }

  guiYeuCau() {
    this.loi.set(''); this.thanhCong.set(''); this.dangGui.set(true);
    this.api.dangKyVay(this.form).subscribe({
      next: kq => {
        this.dangGui.set(false);
        this.thanhCong.set(kq.thongBao);
        setTimeout(() => this.router.navigate(['/portal/khoan-vay']), 1400);
      },
      error: err => {
        this.dangGui.set(false);
        this.loi.set(err.error?.thongBao ?? 'Gửi yêu cầu thất bại');
      }
    });
  }
}
