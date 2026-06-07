import { Routes } from '@angular/router';
import { authGuard, nhanVienGuard, adminGuard, khachHangGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dang-nhap' },

  // ---- Cong khai ----
  { path: 'dang-nhap', loadComponent: () => import('./auth/login').then(m => m.LoginComponent) },
  { path: 'dang-ky', loadComponent: () => import('./auth/register').then(m => m.RegisterComponent) },
  { path: 'quen-mat-khau', loadComponent: () => import('./auth/forgot-password').then(m => m.ForgotPasswordComponent) },

  // ---- Khu vuc quan tri (Admin / Nhan vien) ----
  {
    path: 'quan-tri',
    canActivate: [nhanVienGuard],
    loadComponent: () => import('./layout/admin-shell').then(m => m.AdminShellComponent),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./admin/dashboard').then(m => m.DashboardComponent) },
      { path: 'khach-hang', loadComponent: () => import('./admin/customers').then(m => m.CustomersComponent) },
      { path: 'khach-hang/:id', loadComponent: () => import('./admin/customer-detail').then(m => m.CustomerDetailComponent) },
      { path: 'ho-so-vay', loadComponent: () => import('./admin/loans').then(m => m.LoansComponent) },
      { path: 'ho-so-vay/:id', loadComponent: () => import('./admin/loan-detail').then(m => m.LoanDetailComponent) },
      { path: 'thu-hoi-no', loadComponent: () => import('./admin/collections').then(m => m.CollectionsComponent) },
      { path: 'tai-khoan', canActivate: [adminGuard], loadComponent: () => import('./admin/accounts').then(m => m.AccountsComponent) },
      { path: 'audit-log', canActivate: [adminGuard], loadComponent: () => import('./admin/audit-log').then(m => m.AuditLogComponent) }
    ]
  },

  // ---- Cong khach hang ----
  {
    path: 'portal',
    canActivate: [khachHangGuard],
    loadComponent: () => import('./layout/customer-shell').then(m => m.CustomerShellComponent),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./customer/profile').then(m => m.ProfileComponent) },
      { path: 'khoan-vay', loadComponent: () => import('./customer/my-loans').then(m => m.MyLoansComponent) },
      { path: 'khoan-vay/:id', loadComponent: () => import('./customer/loan-detail').then(m => m.CustomerLoanDetailComponent) },
      { path: 'lich-su', loadComponent: () => import('./customer/history').then(m => m.HistoryComponent) },
      { path: 'dang-ky-vay', loadComponent: () => import('./customer/apply').then(m => m.ApplyComponent) }
    ]
  },

  { path: '**', redirectTo: 'dang-nhap' }
];
