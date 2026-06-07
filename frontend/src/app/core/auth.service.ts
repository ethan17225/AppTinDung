import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResult } from './models';

const KEY = 'tindung_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthResult | null>(this.docTuLocalStorage());

  user = this._user.asReadonly();
  daDangNhap = computed(() => this._user() !== null);
  vaiTro = computed(() => this._user()?.vaiTro ?? null);
  laAdmin = computed(() => this._user()?.vaiTro === 'Admin');
  laNhanVien = computed(() => ['Admin', 'NhanVien'].includes(this._user()?.vaiTro ?? ''));
  laKhachHang = computed(() => this._user()?.vaiTro === 'KhachHang');

  constructor(private http: HttpClient) {}

  private docTuLocalStorage(): AuthResult | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private luu(kq: AuthResult) {
    localStorage.setItem(KEY, JSON.stringify(kq));
    this._user.set(kq);
  }

  get token(): string | null {
    return this._user()?.token ?? null;
  }

  dangNhap(tenDangNhap: string, matKhau: string): Observable<AuthResult> {
    return this.http.post<AuthResult>('/api/Auth/dang-nhap', { tenDangNhap, matKhau })
      .pipe(tap(kq => this.luu(kq)));
  }

  dangKy(data: any): Observable<AuthResult> {
    return this.http.post<AuthResult>('/api/Auth/dang-ky', data)
      .pipe(tap(kq => this.luu(kq)));
  }

  quenMatKhau(email: string) {
    return this.http.post<{ thongBao: string; maXacNhan: string }>(
      '/api/Auth/quen-mat-khau', { email });
  }

  datLaiMatKhau(email: string, maXacNhan: string, matKhauMoi: string) {
    return this.http.post<{ thongBao: string }>(
      '/api/Auth/dat-lai-mat-khau', { email, maXacNhan, matKhauMoi });
  }

  dangXuat() {
    localStorage.removeItem(KEY);
    this._user.set(null);
  }
}
