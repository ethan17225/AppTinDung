import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { BrandPanelComponent } from './brand-panel';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink, BrandPanelComponent],
  template: `
    <div class="auth-wrap">
      <app-brand-panel />

      <div class="auth-panel">
        <div class="auth-card">
          <h2>Quên mật khẩu</h2>
          <p class="lead">
            {{ buoc() === 1 ? 'Nhập email đăng ký để nhận mã xác nhận.' : 'Nhập mã xác nhận và mật khẩu mới.' }}
          </p>

          @if (loi()) { <div class="alert alert-error">{{ loi() }}</div> }
          @if (thanhCong()) { <div class="alert alert-ok">{{ thanhCong() }}</div> }

          @if (buoc() === 1) {
            <form (ngSubmit)="guiMa()">
              <div class="field">
                <label>Email đăng ký</label>
                <input class="input" type="email" name="email" [(ngModel)]="email" required>
              </div>
              <button class="btn btn-primary btn-block" type="submit" [disabled]="dangXuLy()">
                {{ dangXuLy() ? 'Đang gửi...' : 'Gửi mã xác nhận' }}
              </button>
            </form>
          } @else {
            <form (ngSubmit)="datLai()">
              <div class="field">
                <label>Mã xác nhận</label>
                <input class="input" name="ma" [(ngModel)]="maXacNhan" required>
              </div>
              <div class="field">
                <label>Mật khẩu mới</label>
                <input class="input" type="password" name="mkMoi" [(ngModel)]="matKhauMoi" required>
              </div>
              <button class="btn btn-primary btn-block" type="submit" [disabled]="dangXuLy()">
                {{ dangXuLy() ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
              </button>
            </form>
          }

          <p class="auth-foot"><a routerLink="/dang-nhap">Quay lại đăng nhập</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './auth.scss'
})
export class ForgotPasswordComponent {
  email = '';
  maXacNhan = '';
  matKhauMoi = '';
  buoc = signal(1);
  loi = signal('');
  thanhCong = signal('');
  dangXuLy = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  guiMa() {
    this.loi.set(''); this.thanhCong.set(''); this.dangXuLy.set(true);
    this.auth.quenMatKhau(this.email).subscribe({
      next: kq => {
        this.dangXuLy.set(false);
        this.buoc.set(2);
        // Mo phong gui email: hien thi ma truc tiep de demo
        this.thanhCong.set(`${kq.thongBao} Mã của bạn: ${kq.maXacNhan}`);
      },
      error: err => {
        this.dangXuLy.set(false);
        this.loi.set(err.error?.thongBao ?? 'Không gửi được mã');
      }
    });
  }

  datLai() {
    this.loi.set(''); this.thanhCong.set(''); this.dangXuLy.set(true);
    this.auth.datLaiMatKhau(this.email, this.maXacNhan, this.matKhauMoi).subscribe({
      next: () => {
        this.dangXuLy.set(false);
        this.thanhCong.set('Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...');
        setTimeout(() => this.router.navigate(['/dang-nhap']), 1500);
      },
      error: err => {
        this.dangXuLy.set(false);
        this.loi.set(err.error?.thongBao ?? 'Đổi mật khẩu thất bại');
      }
    });
  }
}
