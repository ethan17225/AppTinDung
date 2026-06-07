import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  KhachHang, LichSuCIC, HopDong, HopDongChiTiet, GiaoDich,
  TaiKhoan, TongQuan, CanhBaoNo, NhomNoThongKe, AuditLog
} from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ---- Khach hang (KYC) ----
  dsKhachHang() { return this.http.get<KhachHang[]>('/api/khach-hang'); }
  chiTietKhachHang(id: number) { return this.http.get<KhachHang>(`/api/khach-hang/${id}`); }
  lichSuCic(id: number) { return this.http.get<LichSuCIC[]>(`/api/khach-hang/${id}/lich-su-cic`); }
  capNhatKhachHang(id: number, data: any) { return this.http.put(`/api/khach-hang/${id}`, data); }

  // ---- Hop dong ----
  dsHopDong() { return this.http.get<HopDong[]>('/api/hop-dong'); }
  chiTietHopDong(id: number) { return this.http.get<HopDongChiTiet>(`/api/hop-dong/${id}`); }
  taoHopDong(data: any) { return this.http.post<{ id: number; thongBao: string }>('/api/hop-dong', data); }
  dangKyVay(data: any) { return this.http.post<{ id: number; thongBao: string }>('/api/hop-dong/dang-ky-vay', data); }
  duyetHopDong(id: number) { return this.http.post(`/api/hop-dong/${id}/duyet`, {}); }
  tuChoiHopDong(id: number) { return this.http.post(`/api/hop-dong/${id}/tu-choi`, {}); }
  ganNhanVien(id: number, nhanVienId: number) { return this.http.post(`/api/hop-dong/${id}/gan-nhan-vien`, { nhanVienId }); }

  // ---- Thanh toan ----
  thanhToan(lichTraId: number) { return this.http.post<any>('/api/thanh-toan', { lichTraId }); }
  lichSuGiaoDich() { return this.http.get<GiaoDich[]>('/api/thanh-toan/lich-su'); }

  // ---- Thu hoi no ----
  canhBaoNo() { return this.http.get<CanhBaoNo[]>('/api/thu-hoi-no/canh-bao'); }
  phanLoaiNhomNo() { return this.http.get<NhomNoThongKe[]>('/api/thu-hoi-no/phan-loai-nhom-no'); }
  chayBatch() { return this.http.post<any>('/api/thu-hoi-no/chay-batch', {}); }

  // ---- Bao cao ----
  tongQuan() { return this.http.get<TongQuan>('/api/bao-cao/tong-quan'); }

  // ---- Tai khoan (Admin) ----
  dsTaiKhoan() { return this.http.get<TaiKhoan[]>('/api/tai-khoan'); }
  dsNhanVien() { return this.http.get<{ id: number; tenDangNhap: string; vaiTro: string }[]>('/api/tai-khoan/nhan-vien'); }
  taoTaiKhoan(data: any) { return this.http.post('/api/tai-khoan', data); }
  doiTrangThaiTaiKhoan(id: number) { return this.http.post(`/api/tai-khoan/${id}/doi-trang-thai`, {}); }
  xoaTaiKhoan(id: number) { return this.http.delete(`/api/tai-khoan/${id}`); }

  // ---- Audit log ----
  auditLog() { return this.http.get<AuditLog[]>('/api/audit-log'); }
}
