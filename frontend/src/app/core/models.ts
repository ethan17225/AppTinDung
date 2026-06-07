// Cac kieu du lieu dung chung trong ung dung

export interface AuthResult {
  token: string;
  taiKhoanId: number;
  tenDangNhap: string;
  vaiTro: 'Admin' | 'NhanVien' | 'KhachHang';
  khachHangId: number | null;
  hoTen: string;
}

export interface KhachHang {
  id: number;
  hoTen: string;
  email: string;
  sdt: string;
  diaChi: string;
  cccd: string;
  diemCIC: number;
  ngayTao: string;
  nhomNo?: number;
  tenNhomNo?: string;
  soHopDong?: number;
}

export interface LichSuCIC {
  id: number;
  diemCu: number;
  diemMoi: number;
  lyDo: string;
  thoiGian: string;
}

export interface HopDong {
  id: number;
  khachHangId: number;
  tenKhachHang: string;
  hanMuc: number;
  kyHanThang: number;
  laiSuat: number;
  mucDich: string;
  trangThai: string;
  duNoConLai: number;
  ngayTao: string;
  ngayGiaiNgan: string | null;
  nhanVienId: number | null;
}

export interface LichTra {
  id: number;
  kyThu: number;
  ngayDenHan: string;
  soTienGoc: number;
  soTienLai: number;
  tongKy: number;
  daThanhToan: boolean;
  ngayThanhToan: string | null;
}

export interface GiaoDich {
  id: number;
  hopDongId: number;
  soTien: number;
  thoiGian: string;
  loaiGiaoDich: string;
  ghiChu: string;
}

export interface HopDongChiTiet extends HopDong {
  lichTra: LichTra[];
  giaoDich: GiaoDich[];
}

export interface TaiKhoan {
  id: number;
  tenDangNhap: string;
  email: string;
  vaiTro: string;
  dangHoatDong: boolean;
  ngayTao: string;
  khachHangId: number | null;
}

export interface TongQuan {
  tongDuNo: number;
  tyLeNoXau: number;
  soHopDongMoiThangNay: number;
  tongSoHopDong: number;
  soHopDongDangVay: number;
  soHopDongChoDuyet: number;
  soKhachHang: number;
}

export interface CanhBaoNo {
  id: number;
  hopDongId: number;
  tenKhachHang: string;
  kyThu: number;
  ngayDenHan: string;
  soTien: number;
  soNgayTre: number;
  quaHan: boolean;
  diemCIC: number;
  nhomNo: number;
}

export interface NhomNoThongKe {
  nhom: number;
  ten: string;
  soLuong: number;
}

export interface AuditLog {
  id: number;
  nguoiThucHien: string;
  hanhDong: string;
  doiTuong: string;
  chiTiet: string;
  thoiGian: string;
}
