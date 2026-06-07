namespace TinDungApi.Models;

// Lich tra no theo tung ky (mot dong cho moi ky)
public class LichTra
{
    public int Id { get; set; }

    public int HopDongId { get; set; }
    public HopDong? HopDong { get; set; }

    // Ky thu may (1, 2, 3, ...)
    public int KyThu { get; set; }

    public DateTime NgayDenHan { get; set; }

    // So tien goc phai tra trong ky
    public decimal SoTienGoc { get; set; }

    // So tien lai phai tra trong ky
    public decimal SoTienLai { get; set; }

    public bool DaThanhToan { get; set; } = false;

    public DateTime? NgayThanhToan { get; set; }

    // So lan da bi tru diem CIC do qua han (moi 5 ngay tre = 1 lan -50 diem)
    // Dung de batch tru diem khong bi lap lai
    public int SoLanTruDiem { get; set; } = 0;
}
