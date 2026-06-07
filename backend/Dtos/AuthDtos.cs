namespace TinDungApi.Dtos;

// ===== Xac thuc =====

public class DangNhapDto
{
    public string TenDangNhap { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
}

public class DangKyDto
{
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SDT { get; set; } = string.Empty;
    public string DiaChi { get; set; } = string.Empty;
    public string CCCD { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
}

public class QuenMatKhauDto
{
    public string Email { get; set; } = string.Empty;
}

public class DatLaiMatKhauDto
{
    public string Email { get; set; } = string.Empty;
    public string MaXacNhan { get; set; } = string.Empty;
    public string MatKhauMoi { get; set; } = string.Empty;
}

public class AuthResultDto
{
    public string Token { get; set; } = string.Empty;
    public int TaiKhoanId { get; set; }
    public string TenDangNhap { get; set; } = string.Empty;
    public string VaiTro { get; set; } = string.Empty;
    public int? KhachHangId { get; set; }
    public string HoTen { get; set; } = string.Empty;
}
