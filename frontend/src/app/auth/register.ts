import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { BrandPanelComponent } from './brand-panel';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, BrandPanelComponent],
  template: `
    <div class="auth-wrap">
      <app-brand-panel />

      <div class="auth-panel">
        <div class="auth-card" style="max-width:440px">
          <h2>Tạo tài khoản</h2>
          <p class="lead">Dành cho khách hàng mới. Vui lòng điền phiếu đăng ký.</p>

          @if (loi()) { <div class="alert alert-error">{{ loi() }}</div> }

          <form (ngSubmit)="dangKy()">
            <div class="field">
              <label>Họ và tên</label>
              <input class="input" name="hoTen" [(ngModel)]="data.hoTen" required>
            </div>
            <div class="flex gap-12">
              <div class="field grow">
                <label>Số điện thoại</label>
                <input class="input" name="sdt" [(ngModel)]="data.sdt" required>
              </div>
              <div class="field grow">
                <label>CCCD</label>
                <input class="input" name="cccd" [(ngModel)]="data.cccd" required>
              </div>
            </div>
            <div class="field">
              <label>Email</label>
              <input class="input" type="email" name="email" [(ngModel)]="data.email" required>
            </div>
            <div class="field">
              <label>Địa chỉ</label>
              <input class="input" name="diaChi" [(ngModel)]="data.diaChi" required>
            </div>
            <div class="field">
              <label>Mật khẩu</label>
              <input class="input" type="password" name="matKhau" [(ngModel)]="data.matKhau" required>
            </div>
            <button class="btn btn-primary btn-block" type="submit" [disabled]="dangXuLy()">
              {{ dangXuLy() ? 'Đang tạo...' : 'Đăng ký' }}
            </button>
          </form>

          <p class="auth-foot">Đã có tài khoản? <a routerLink="/dang-nhap">Đăng nhập</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './auth.scss'
})
export class RegisterComponent {
  data = { hoTen: '', email: '', sdt: '', diaChi: '', cccd: '', matKhau: '' };
  loi = signal('');
  dangXuLy = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  dangKy() {
    this.loi.set('');
    this.dangXuLy.set(true);
    this.auth.dangKy(this.data).subscribe({
      next: () => {
        this.dangXuLy.set(false);
        this.router.navigate(['/portal']);
      },
      error: err => {
        this.dangXuLy.set(false);
        this.loi.set(err.error?.thongBao ?? 'Đăng ký thất bại');
      }
    });
  }
}
