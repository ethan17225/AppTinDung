import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Yeu cau dang nhap
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.daDangNhap()) return true;
  router.navigate(['/dang-nhap']);
  return false;
};

// Yeu cau vai tro Admin hoac NhanVien (khu vuc quan tri)
export const nhanVienGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.laNhanVien()) return true;
  router.navigate([auth.laKhachHang() ? '/portal' : '/dang-nhap']);
  return false;
};

// Yeu cau vai tro Admin
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.laAdmin()) return true;
  router.navigate(['/quan-tri']);
  return false;
};

// Yeu cau vai tro Khach hang
export const khachHangGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.laKhachHang()) return true;
  router.navigate([auth.laNhanVien() ? '/quan-tri' : '/dang-nhap']);
  return false;
};
