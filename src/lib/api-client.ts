"use client";

import { docToken } from "./auth-context";
import type {
  AuthResult,
  KhachHang,
  LichSuCIC,
  HopDong,
  HopDongChiTiet,
  GiaoDich,
  TaiKhoan,
  TongQuan,
  CanhBaoNo,
  NhomNoThongKe,
  AuditLog,
} from "./types";

// Lỗi trả về từ API (kèm thông báo tiếng Việt)
export class ApiClientError extends Error {
  status: number;
  thongBao: string;
  constructor(status: number, thongBao: string) {
    super(thongBao);
    this.status = status;
    this.thongBao = thongBao;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = docToken();
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const thongBao =
      (data && (data.thongBao as string)) || "Đã xảy ra lỗi, vui lòng thử lại";
    throw new ApiClientError(res.status, thongBao);
  }
  return data as T;
}

export const api = {
  // ---- Xác thực ----
  dangNhap: (tenDangNhap: string, matKhau: string) =>
    request<AuthResult>("POST", "/api/auth/dang-nhap", { tenDangNhap, matKhau }),
  dangKy: (data: unknown) =>
    request<AuthResult>("POST", "/api/auth/dang-ky", data),
  quenMatKhau: (email: string) =>
    request<{ thongBao: string; maXacNhan: string }>(
      "POST",
      "/api/auth/quen-mat-khau",
      { email }
    ),
  datLaiMatKhau: (email: string, maXacNhan: string, matKhauMoi: string) =>
    request<{ thongBao: string }>("POST", "/api/auth/dat-lai-mat-khau", {
      email,
      maXacNhan,
      matKhauMoi,
    }),

  // ---- Khách hàng (KYC) ----
  dsKhachHang: () => request<KhachHang[]>("GET", "/api/khach-hang"),
  chiTietKhachHang: (id: number) =>
    request<KhachHang>("GET", `/api/khach-hang/${id}`),
  lichSuCic: (id: number) =>
    request<LichSuCIC[]>("GET", `/api/khach-hang/${id}/lich-su-cic`),
  capNhatKhachHang: (id: number, data: unknown) =>
    request<{ thongBao: string }>("PUT", `/api/khach-hang/${id}`, data),

  // ---- Hợp đồng ----
  dsHopDong: () => request<HopDong[]>("GET", "/api/hop-dong"),
  chiTietHopDong: (id: number) =>
    request<HopDongChiTiet>("GET", `/api/hop-dong/${id}`),
  taoHopDong: (data: unknown) =>
    request<{ id: number; thongBao: string }>("POST", "/api/hop-dong", data),
  dangKyVay: (data: unknown) =>
    request<{ id: number; thongBao: string }>(
      "POST",
      "/api/hop-dong/dang-ky-vay",
      data
    ),
  duyetHopDong: (id: number) =>
    request<{ thongBao: string }>("POST", `/api/hop-dong/${id}/duyet`, {}),
  tuChoiHopDong: (id: number) =>
    request<{ thongBao: string }>("POST", `/api/hop-dong/${id}/tu-choi`, {}),
  ganNhanVien: (id: number, nhanVienId: number) =>
    request<{ thongBao: string }>("POST", `/api/hop-dong/${id}/gan-nhan-vien`, {
      nhanVienId,
    }),

  // ---- Thanh toán ----
  thanhToan: (lichTraId: number) =>
    request<{ thongBao: string; bienLai: BienLai }>("POST", "/api/thanh-toan", {
      lichTraId,
    }),
  lichSuGiaoDich: () => request<GiaoDich[]>("GET", "/api/thanh-toan/lich-su"),

  // ---- Thu hồi nợ ----
  canhBaoNo: () => request<CanhBaoNo[]>("GET", "/api/thu-hoi-no/canh-bao"),
  phanLoaiNhomNo: () =>
    request<NhomNoThongKe[]>("GET", "/api/thu-hoi-no/phan-loai-nhom-no"),
  chayBatch: () =>
    request<{ thongBao: string; soKyQuaHan: number; soLanTruDiem: number }>(
      "POST",
      "/api/thu-hoi-no/chay-batch",
      {}
    ),

  // ---- Báo cáo ----
  tongQuan: () => request<TongQuan>("GET", "/api/bao-cao/tong-quan"),

  // ---- Tài khoản (Admin) ----
  dsTaiKhoan: () => request<TaiKhoan[]>("GET", "/api/tai-khoan"),
  dsNhanVien: () =>
    request<{ id: number; tenDangNhap: string; vaiTro: string }[]>(
      "GET",
      "/api/tai-khoan/nhan-vien"
    ),
  taoTaiKhoan: (data: unknown) =>
    request<{ id: number; thongBao: string }>("POST", "/api/tai-khoan", data),
  doiTrangThaiTaiKhoan: (id: number) =>
    request<{ thongBao: string; dangHoatDong: boolean }>(
      "POST",
      `/api/tai-khoan/${id}/doi-trang-thai`,
      {}
    ),
  xoaTaiKhoan: (id: number) =>
    request<{ thongBao: string }>("DELETE", `/api/tai-khoan/${id}`),

  // ---- Audit log ----
  auditLog: () => request<AuditLog[]>("GET", "/api/audit-log"),
};

export interface BienLai {
  maGiaoDich: string;
  kyThu: number;
  soTien: number;
  thoiGian: string;
  hopDongId: number;
  tenKhachHang: string;
  duNoConLai: number;
}
