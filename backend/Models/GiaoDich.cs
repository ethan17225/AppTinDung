namespace TinDungApi.Models;

// Ghi nhan moi bien dong tien ra/vao cua mot hop dong
public class GiaoDich
{
    public int Id { get; set; }

    public int HopDongId { get; set; }
    public HopDong? HopDong { get; set; }

    public decimal SoTien { get; set; }

    public DateTime ThoiGian { get; set; } = DateTime.Now;

    public LoaiGiaoDich LoaiGiaoDich { get; set; }

    public string GhiChu { get; set; } = string.Empty;
}
