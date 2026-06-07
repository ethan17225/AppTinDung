namespace TinDungApi.Models;

// Lich su bien dong diem tin dung CIC
public class LichSuCIC
{
    public int Id { get; set; }

    public int KhachHangId { get; set; }
    public KhachHang? KhachHang { get; set; }

    public int DiemCu { get; set; }
    public int DiemMoi { get; set; }

    public string LyDo { get; set; } = string.Empty;

    public DateTime ThoiGian { get; set; } = DateTime.Now;
}
