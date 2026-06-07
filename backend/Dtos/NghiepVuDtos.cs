namespace TinDungApi.Dtos;

// ===== Khach hang (KYC) =====
public class KhachHangDto
{
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SDT { get; set; } = string.Empty;
    public string DiaChi { get; set; } = string.Empty;
    public string CCCD { get; set; } = string.Empty;
}

// ===== Hop dong vay =====
public class TaoHopDongDto
{
    public int KhachHangId { get; set; }
    public decimal HanMuc { get; set; }
    public int KyHanThang { get; set; }
    public decimal LaiSuat { get; set; }
    public string MucDich { get; set; } = string.Empty;
}

// Khach hang gui yeu cau vay (tu lay KhachHangId tu token)
public class DangKyVayDto
{
    public decimal HanMuc { get; set; }
    public int KyHanThang { get; set; }
    public string MucDich { get; set; } = string.Empty;
}

public class GanNhanVienDto
{
    public int NhanVienId { get; set; }
}

// ===== Thanh toan =====
public class ThanhToanDto
{
    public int LichTraId { get; set; }
}

// ===== Tai khoan (Admin) =====
public class TaoTaiKhoanDto
{
    public string TenDangNhap { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
    public string VaiTro { get; set; } = "NhanVien";
}
