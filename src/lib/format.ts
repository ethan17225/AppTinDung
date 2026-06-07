// Định dạng & nhãn dùng chung (chuyển thể từ core/util.ts của Angular)

// Định dạng tiền tệ VND: 1500000 -> "1.500.000 đ"
export function tien(value: number | null | undefined): string {
  if (value == null) return "0 đ";
  return value.toLocaleString("vi-VN") + " đ";
}

// Định dạng ngày: dd/MM/yyyy
export function ngay(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// Định dạng ngày giờ: dd/MM/yyyy HH:mm
export function ngayGio(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()} ${hh}:${mi}`;
}

// Nhãn & màu cho trạng thái hợp đồng
export function nhanTrangThai(tt: string): { text: string; cls: string } {
  switch (tt) {
    case "ChoDuyet":
      return { text: "Chờ duyệt", cls: "badge-warn" };
    case "DaGiaiNgan":
      return { text: "Đã giải ngân", cls: "badge-info" };
    case "DangVay":
      return { text: "Đang vay", cls: "badge-info" };
    case "TatToan":
      return { text: "Tất toán", cls: "badge-ok" };
    case "TuChoi":
      return { text: "Từ chối", cls: "badge-danger" };
    default:
      return { text: tt, cls: "badge-neutral" };
  }
}

// Nhãn & màu cho nhóm nợ
export function nhanNhomNo(nhom: number): { text: string; cls: string } {
  switch (nhom) {
    case 1:
      return { text: "Nhóm 1 - Nợ đủ tiêu chuẩn", cls: "badge-ok" };
    case 2:
      return { text: "Nhóm 2 - Nợ cần chú ý", cls: "badge-info" };
    case 3:
      return { text: "Nhóm 3 - Nợ dưới tiêu chuẩn", cls: "badge-warn" };
    case 4:
      return { text: "Nhóm 4 - Nợ nghi ngờ", cls: "badge-warn" };
    case 5:
      return { text: "Nhóm 5 - Nợ có khả năng mất vốn", cls: "badge-danger" };
    default:
      return { text: "Nhóm " + nhom, cls: "badge-neutral" };
  }
}

// Vai trò hiển thị
export function nhanVaiTro(vt: string): string {
  switch (vt) {
    case "Admin":
      return "Quản trị viên";
    case "NhanVien":
      return "Nhân viên tín dụng";
    case "KhachHang":
      return "Khách hàng";
    default:
      return vt;
  }
}
