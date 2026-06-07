import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { TaiKhoan } from '../core/models';
import { nhanVaiTro } from '../core/util';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="section-head">
      <div>
        <h1 class="page-title">Quản lý tài khoản</h1>
        <p class="muted" style="margin:0">Tạo, khóa và xóa tài khoản người dùng hệ thống.</p>
      </div>
      <button class="btn btn-primary" (click)="moTao.set(!moTao())">＋ Tạo tài khoản</button>
    </div>

    @if (thongBao()) { <div class="alert alert-ok">{{ thongBao() }}</div> }
    @if (loi()) { <div class="alert alert-error">{{ loi() }}</div> }

    @if (moTao()) {
      <div class="card card-pad" style="margin-bottom:18px">
        <h3 style="font-size:16px;margin-bottom:14px">Tài khoản mới</h3>
        <div class="flex gap-12 wrap">
          <div class="field grow"><label>Tên đăng nhập</label><input class="input" [(ngModel)]="form.tenDangNhap"></div>
          <div class="field grow"><label>Email</label><input class="input" [(ngModel)]="form.email"></div>
        </div>
        <div class="flex gap-12 wrap">
          <div class="field grow"><label>Mật khẩu</label><input class="input" type="password" [(ngModel)]="form.matKhau"></div>
          <div class="field grow">
            <label>Vai trò</label>
            <select class="select" [(ngModel)]="form.vaiTro">
              <option value="NhanVien">Nhân viên tín dụng</option>
              <option value="Admin">Quản trị viên</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary" (click)="tao()">Lưu</button>
      </div>
    }

    <div class="card table-wrap">
      <table class="tbl">
        <thead><tr><th>ID</th><th>Tên đăng nhập</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày tạo</th><th></th></tr></thead>
        <tbody>
          @for (t of ds(); track t.id) {
            <tr>
              <td>#{{ t.id }}</td>
              <td style="font-weight:600">{{ t.tenDangNhap }}</td>
              <td>{{ t.email }}</td>
              <td><span class="badge badge-neutral">{{ vaiTro(t.vaiTro) }}</span></td>
              <td>
                @if (t.dangHoatDong) { <span class="badge badge-ok">Hoạt động</span> }
                @else { <span class="badge badge-danger">Đã khóa</span> }
              </td>
              <td>{{ t.ngayTao | date:'dd/MM/yyyy' }}</td>
              <td class="flex gap-8">
                <button class="btn btn-ghost btn-sm" (click)="doiTrangThai(t.id)">
                  {{ t.dangHoatDong ? 'Khóa' : 'Mở' }}
                </button>
                @if (t.tenDangNhap !== 'ADMIN') {
                  <button class="btn btn-danger btn-sm" (click)="xoa(t.id)">Xóa</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AccountsComponent implements OnInit {
  ds = signal<TaiKhoan[]>([]);
  moTao = signal(false);
  thongBao = signal('');
  loi = signal('');
  form = { tenDangNhap: '', email: '', matKhau: '', vaiTro: 'NhanVien' };
  vaiTro = nhanVaiTro;

  constructor(private api: ApiService) {}

  ngOnInit() { this.tai(); }
  tai() { this.api.dsTaiKhoan().subscribe(d => this.ds.set(d)); }

  tao() {
    this.loi.set(''); this.thongBao.set('');
    this.api.taoTaiKhoan(this.form).subscribe({
      next: () => {
        this.thongBao.set('Đã tạo tài khoản');
        this.moTao.set(false);
        this.form = { tenDangNhap: '', email: '', matKhau: '', vaiTro: 'NhanVien' };
        this.tai();
      },
      error: err => this.loi.set(err.error?.thongBao ?? 'Tạo tài khoản thất bại')
    });
  }

  doiTrangThai(id: number) {
    this.api.doiTrangThaiTaiKhoan(id).subscribe(() => this.tai());
  }
  xoa(id: number) {
    this.api.xoaTaiKhoan(id).subscribe({
      next: () => { this.thongBao.set('Đã xóa tài khoản'); this.tai(); },
      error: err => this.loi.set(err.error?.thongBao ?? 'Không xóa được')
    });
  }
}
