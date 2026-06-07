namespace TinDungApi.Models;

// Luu vet thao tac nguoi dung phuc vu kiem toan
public class AuditLog
{
    public int Id { get; set; }

    public int? TaiKhoanId { get; set; }

    // Ten nguoi thao tac (luu kem de tien tra cuu)
    public string NguoiThucHien { get; set; } = string.Empty;

    public string HanhDong { get; set; } = string.Empty;

    public string DoiTuong { get; set; } = string.Empty;

    public string ChiTiet { get; set; } = string.Empty;

    public DateTime ThoiGian { get; set; } = DateTime.Now;
}
