using TinDungApi.Models;

namespace TinDungApi.Services;

// Cac ham nghiep vu dung chung (phan loai no, tao lich tra)
public static class NghiepVu
{
    // Phan loai nhom no dua tren diem CIC
    // Nhom 1: 690-700 | Nhom 2: 670-689 | Nhom 3: 650-669
    // Nhom 4: 600-649 | Nhom 5: < 600 (no xau)
    public static int NhomNo(int diemCIC)
    {
        if (diemCIC >= 690) return 1;
        if (diemCIC >= 670) return 2;
        if (diemCIC >= 650) return 3;
        if (diemCIC >= 600) return 4;
        return 5;
    }

    public static string TenNhomNo(int nhom) => nhom switch
    {
        1 => "Nhóm 1 - Nợ đủ tiêu chuẩn",
        2 => "Nhóm 2 - Nợ cần chú ý",
        3 => "Nhóm 3 - Nợ dưới tiêu chuẩn",
        4 => "Nhóm 4 - Nợ nghi ngờ",
        _ => "Nhóm 5 - Nợ có khả năng mất vốn"
    };

    // No xau la tu nhom 3 tro len theo quy uoc (CIC < 670)
    public static bool LaNoXau(int diemCIC) => NhomNo(diemCIC) >= 5;

    // Tao lich tra theo phuong phap du no giam dan:
    // moi ky tra goc bang nhau, lai tinh tren du no con lai (theo du no giam dan).
    public static List<LichTra> TaoLichTra(HopDong hd)
    {
        var lich = new List<LichTra>();
        decimal goc = hd.HanMuc;
        decimal gocMoiKy = Math.Round(goc / hd.KyHanThang, 0);
        decimal laiSuatThang = hd.LaiSuat / 100m / 12m;
        decimal duNo = goc;

        for (int ky = 1; ky <= hd.KyHanThang; ky++)
        {
            // Ky cuoi tra het phan goc con lai (tranh sai so lam tron)
            decimal gocKy = ky == hd.KyHanThang ? duNo : gocMoiKy;
            decimal laiKy = Math.Round(duNo * laiSuatThang, 0);

            lich.Add(new LichTra
            {
                KyThu = ky,
                NgayDenHan = (hd.NgayGiaiNgan ?? DateTime.Now).AddMonths(ky),
                SoTienGoc = gocKy,
                SoTienLai = laiKy,
                DaThanhToan = false
            });

            duNo -= gocKy;
        }
        return lich;
    }
}
