namespace TinDungApi.Models;

// Ho so / hop dong vay
public class HopDong
{
    public int Id { get; set; }

    public int KhachHangId { get; set; }
    public KhachHang? KhachHang { get; set; }

    // Nhan vien tin dung duoc giao xu ly ho so (co the chua gan)
    public int? NhanVienId { get; set; }

    // Han muc giai ngan (so tien vay goc)
    public decimal HanMuc { get; set; }

    // Ky han tinh theo thang
    public int KyHanThang { get; set; }

    // Lai suat nam (%) vi du 12 = 12%/nam
    public decimal LaiSuat { get; set; }

    // Muc dich vay (mo ta ngan)
    public string MucDich { get; set; } = string.Empty;

    public TrangThaiHopDong TrangThai { get; set; } = TrangThaiHopDong.ChoDuyet;

    // Du no goc con lai
    public decimal DuNoConLai { get; set; }

    public DateTime NgayTao { get; set; } = DateTime.Now;
    public DateTime? NgayGiaiNgan { get; set; }

    public List<LichTra> LichTras { get; set; } = new();
    public List<GiaoDich> GiaoDichs { get; set; } = new();
}
