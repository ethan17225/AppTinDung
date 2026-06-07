using System.ComponentModel.DataAnnotations;

namespace TinDungApi.Models;

// Tai khoan dang nhap he thong
public class TaiKhoan
{
    public int Id { get; set; }

    [Required]
    public string TenDangNhap { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    [Required]
    public string MatKhauHash { get; set; } = string.Empty;

    public VaiTro VaiTro { get; set; } = VaiTro.KhachHang;

    public bool DangHoatDong { get; set; } = true;

    public DateTime NgayTao { get; set; } = DateTime.Now;

    // Ma xac nhan dung cho chuc nang quen mat khau (gia lap gui email)
    public string? MaXacNhan { get; set; }

    // Lien ket toi ho so khach hang (chi voi vai tro KhachHang)
    public int? KhachHangId { get; set; }
    public KhachHang? KhachHang { get; set; }
}
