import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-customer-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <aside class="side">
        <div class="side-logo"><span class="dot">T</span> App Tín Dụng</div>

        <div class="nav-group-title">Tài khoản của tôi</div>
        <a class="nav-link" routerLink="/portal" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
          <span class="ico">☺</span> Trang cá nhân
        </a>
        <a class="nav-link" routerLink="/portal/khoan-vay" routerLinkActive="active">
          <span class="ico">▤</span> Khoản vay của tôi
        </a>
        <a class="nav-link" routerLink="/portal/lich-su" routerLinkActive="active">
          <span class="ico">⇄</span> Lịch sử giao dịch
        </a>
        <a class="nav-link" routerLink="/portal/dang-ky-vay" routerLinkActive="active">
          <span class="ico">＋</span> Đăng ký vay mới
        </a>

        <div class="side-user">
          <div class="who">
            <div class="name">{{ auth.user()?.hoTen }}</div>
            <div class="role">Khách hàng</div>
          </div>
          <button class="logout" (click)="dangXuat()"><span>⎋</span> Đăng xuất</button>
        </div>
      </aside>

      <main class="main">
        <div class="main-inner">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styleUrl: './shell.scss'
})
export class CustomerShellComponent {
  constructor(public auth: AuthService, private router: Router) {}

  dangXuat() {
    this.auth.dangXuat();
    this.router.navigate(['/dang-nhap']);
  }
}
