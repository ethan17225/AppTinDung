// Các hàm nghiệp vụ dùng chung (phân loại nợ, tạo lịch trả)
// Chuyển thể từ Services/NghiepVu.cs của backend.

// Phân loại nhóm nợ dựa trên điểm CIC
// Nhóm 1: 690-700 | Nhóm 2: 670-689 | Nhóm 3: 650-669
// Nhóm 4: 600-649 | Nhóm 5: < 600 (nợ xấu)
export function nhomNo(diemCIC: number): number {
  if (diemCIC >= 690) return 1;
  if (diemCIC >= 670) return 2;
  if (diemCIC >= 650) return 3;
  if (diemCIC >= 600) return 4;
  return 5;
}

export function tenNhomNo(nhom: number): string {
  switch (nhom) {
    case 1:
      return "Nhóm 1 - Nợ đủ tiêu chuẩn";
    case 2:
      return "Nhóm 2 - Nợ cần chú ý";
    case 3:
      return "Nhóm 3 - Nợ dưới tiêu chuẩn";
    case 4:
      return "Nhóm 4 - Nợ nghi ngờ";
    default:
      return "Nhóm 5 - Nợ có khả năng mất vốn";
  }
}

// Nợ xấu theo quy ước (nhóm 5)
export function laNoXau(diemCIC: number): boolean {
  return nhomNo(diemCIC) >= 5;
}

// Cộng thêm số tháng vào một mốc thời gian
function themThang(goc: Date, soThang: number): Date {
  const d = new Date(goc);
  d.setMonth(d.getMonth() + soThang);
  return d;
}

export interface KyTra {
  kyThu: number;
  ngayDenHan: Date;
  soTienGoc: number;
  soTienLai: number;
  daThanhToan: boolean;
}

// Tạo lịch trả theo phương pháp dư nợ giảm dần:
// mỗi kỳ trả gốc bằng nhau, lãi tính trên dư nợ còn lại.
export function taoLichTra(
  hanMuc: number,
  kyHanThang: number,
  laiSuat: number,
  ngayGiaiNgan: Date
): KyTra[] {
  const lich: KyTra[] = [];
  const goc = hanMuc;
  const gocMoiKy = Math.round(goc / kyHanThang);
  const laiSuatThang = laiSuat / 100 / 12;
  let duNo = goc;

  for (let ky = 1; ky <= kyHanThang; ky++) {
    // Kỳ cuối trả hết phần gốc còn lại (tránh sai số làm tròn)
    const gocKy = ky === kyHanThang ? duNo : gocMoiKy;
    const laiKy = Math.round(duNo * laiSuatThang);

    lich.push({
      kyThu: ky,
      ngayDenHan: themThang(ngayGiaiNgan, ky),
      soTienGoc: gocKy,
      soTienLai: laiKy,
      daThanhToan: false,
    });

    duNo -= gocKy;
  }
  return lich;
}
