import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { nhanVaiTro } from '../core/util';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <aside class="side">
        <div class="side-logo"><span class="dot">T</span> App Tín Dụng</div>

        <div class="nav-group-title">Nghiệp vụ</div>
        <a class="nav-link" routerLink="/quan-tri" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
          <span class="ico">▦</span> Tổng quan
        </a>
        <a class="nav-link" routerLink="/quan-tri/khach-hang" routerLinkActive="active">
          <span class="ico">☺</span> Khách hàng
        </a>
        <a class="nav-link" routerLink="/quan-tri/ho-so-vay" routerLinkActive="active">
          <span class="ico">▤</span> Hồ sơ vay
        </a>
        <a class="nav-link" routerLink="/quan-tri/thu-hoi-no" routerLinkActive="active">
          <span class="ico">⚠</span> Thu hồi nợ
        </a>

        @if (auth.laAdmin()) {
          <div class="nav-group-title">Quản trị</div>
          <a class="nav-link" routerLink="/quan-tri/tai-khoan" routerLinkActive="active">
            <span class="ico">⚙</span> Tài khoản
          </a>
          <a class="nav-link" routerLink="/quan-tri/audit-log" routerLinkActive="active">
            <span class="ico">❏</span> Nhật ký hệ thống
          </a>
        }

        <div class="side-user">
          <div class="who">
            <div class="name">{{ auth.user()?.hoTen }}</div>
            <div class="role">{{ vaiTro() }}</div>
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
export class AdminShellComponent {
  constructor(public auth: AuthService, private router: Router) {}

  vaiTro() { return nhanVaiTro(this.auth.user()?.vaiTro ?? ''); }

  dangXuat() {
    this.auth.dangXuat();
    this.router.navigate(['/dang-nhap']);
  }
}
