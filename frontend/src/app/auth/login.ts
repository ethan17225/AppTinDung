import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { BrandPanelComponent } from './brand-panel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, BrandPanelComponent],
  template: `
    <div class="auth-wrap">
      <app-brand-panel />

      <div class="auth-panel">
        <div class="auth-card">
          <h2>Đăng nhập</h2>
          <p class="lead">Chào mừng trở lại. Vui lòng đăng nhập để tiếp tục.</p>

          @if (loi()) { <div class="alert alert-error">{{ loi() }}</div> }

          <form (ngSubmit)="dangNhap()">
            <div class="field">
              <label>Tài khoản</label>
              <input class="input" name="tk" [(ngModel)]="tenDangNhap" placeholder="Tên đăng nhập hoặc email" required>
            </div>
            <div class="field">
              <label>Mật khẩu</label>
              <input class="input" type="password" name="mk" [(ngModel)]="matKhau" placeholder="••••••" required>
            </div>
            <div class="flex between items-center" style="margin-bottom:18px">
              <a routerLink="/quen-mat-khau">Quên mật khẩu?</a>
            </div>
            <button class="btn btn-primary btn-block" type="submit" [disabled]="dangXuLy()">
              {{ dangXuLy() ? 'Đang xử lý...' : 'Đăng nhập' }}
            </button>
          </form>

          <div class="hint">Tài khoản quản trị mặc định: <b>ADMIN</b> / <b>12345</b></div>

          <p class="auth-foot">Chưa có tài khoản? <a routerLink="/dang-ky">Tạo tài khoản khách hàng</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './auth.scss'
})
export class LoginComponent {
  tenDangNhap = '';
  matKhau = '';
  loi = signal('');
  dangXuLy = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  dangNhap() {
    this.loi.set('');
    this.dangXuLy.set(true);
    this.auth.dangNhap(this.tenDangNhap, this.matKhau).subscribe({
      next: kq => {
        this.dangXuLy.set(false);
        this.router.navigate([kq.vaiTro === 'KhachHang' ? '/portal' : '/quan-tri']);
      },
      error: err => {
        this.dangXuLy.set(false);
        this.loi.set(err.error?.thongBao ?? 'Đăng nhập thất bại');
      }
    });
  }
}
