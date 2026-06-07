using System.ComponentModel.DataAnnotations;

namespace TinDungApi.Models;

// Thong tin dinh danh (KYC) cua khach hang vay
public class KhachHang
{
    public int Id { get; set; }

    [Required]
    public string HoTen { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    public string SDT { get; set; } = string.Empty;

    public string DiaChi { get; set; } = string.Empty;

    public string CCCD { get; set; } = string.Empty;

    // Diem tin dung CIC, mac dinh 650 cho khach moi
    public int DiemCIC { get; set; } = 650;

    public DateTime NgayTao { get; set; } = DateTime.Now;

    // Quan he
    public List<HopDong> HopDongs { get; set; } = new();
    public List<LichSuCIC> LichSuCICs { get; set; } = new();
}
