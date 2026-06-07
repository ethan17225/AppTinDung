using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinDungApi.Data;
using TinDungApi.Models;
using TinDungApi.Services;

namespace TinDungApi.Controllers;

[ApiController]
[Route("api/thu-hoi-no")]
[Authorize(Roles = "Admin,NhanVien")]
public class ThuHoiNoController : ControllerBase
{
    private readonly AppDbContext _db;

    public ThuHoiNoController(AppDbContext db)
    {
        _db = db;
    }

    // Danh sach cac ky sap den han / qua han chua thanh toan
    [HttpGet("canh-bao")]
    public async Task<IActionResult> CanhBao()
    {
        var homNay = DateTime.Now.Date;
        var ds = await _db.LichTras
            .Include(l => l.HopDong)!.ThenInclude(h => h!.KhachHang)
            .Where(l => !l.DaThanhToan)
            .Where(l => l.NgayDenHan <= homNay.AddDays(7))
            .OrderBy(l => l.NgayDenHan)
            .ToListAsync();

        var ketQua = ds.Select(l =>
        {
            int soNgayTre = (homNay - l.NgayDenHan.Date).Days;
            return new
            {
                l.Id,
                hopDongId = l.HopDongId,
                tenKhachHang = l.HopDong!.KhachHang!.HoTen,
                l.KyThu,
                l.NgayDenHan,
                soTien = l.SoTienGoc + l.SoTienLai,
                soNgayTre = soNgayTre > 0 ? soNgayTre : 0,
                quaHan = soNgayTre > 0,
                diemCIC = l.HopDong!.KhachHang!.DiemCIC,
                nhomNo = NghiepVu.NhomNo(l.HopDong!.KhachHang!.DiemCIC)
            };
        });
        return Ok(ketQua);
    }

    // Thong ke phan loai nhom no toan he thong
    [HttpGet("phan-loai-nhom-no")]
    public async Task<IActionResult> PhanLoaiNhomNo()
    {
        var khachHangs = await _db.KhachHangs.Select(k => k.DiemCIC).ToListAsync();
        var nhom = Enumerable.Range(1, 5).Select(n => new
        {
            nhom = n,
            ten = NghiepVu.TenNhomNo(n),
            soLuong = khachHangs.Count(d => NghiepVu.NhomNo(d) == n)
        });
        return Ok(nhom);
    }

    // Chay batch: quet cac ky qua han, tru diem CIC (moi 5 ngay tre -50)
    [HttpPost("chay-batch")]
    public async Task<IActionResult> ChayBatch()
    {
        var homNay = DateTime.Now.Date;
        var quaHan = await _db.LichTras
            .Include(l => l.HopDong)!.ThenInclude(h => h!.KhachHang)
            .Where(l => !l.DaThanhToan && l.NgayDenHan < homNay)
            .ToListAsync();

        int soLanTru = 0;
        foreach (var l in quaHan)
        {
            int soNgayTre = (homNay - l.NgayDenHan.Date).Days;
            int moc = soNgayTre / 5; // moi 5 ngay = 1 moc

            if (moc > l.SoLanTruDiem)
            {
                int truMoi = moc - l.SoLanTruDiem;
                var kh = l.HopDong!.KhachHang!;
                int diemCu = kh.DiemCIC;
                kh.DiemCIC = Math.Max(300, kh.DiemCIC - truMoi * 50);
                l.SoLanTruDiem = moc;
                soLanTru += truMoi;

                _db.LichSuCICs.Add(new LichSuCIC
                {
                    KhachHangId = kh.Id,
                    DiemCu = diemCu,
                    DiemMoi = kh.DiemCIC,
                    LyDo = $"Quá hạn kỳ {l.KyThu} HĐ #{l.HopDongId}: trễ {soNgayTre} ngày (-{truMoi * 50})"
                });
            }
        }

        this.GhiLog(_db, "Chạy batch thu hồi nợ", "Hệ thống",
            $"Quét {quaHan.Count} kỳ quá hạn, trừ điểm {soLanTru} lần");
        await _db.SaveChangesAsync();

        return Ok(new
        {
            thongBao = "Chạy batch hoàn tất",
            soKyQuaHan = quaHan.Count,
            soLanTruDiem = soLanTru
        });
    }
}
