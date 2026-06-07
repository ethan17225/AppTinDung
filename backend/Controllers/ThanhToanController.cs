using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinDungApi.Data;
using TinDungApi.Dtos;
using TinDungApi.Models;
using TinDungApi.Services;

namespace TinDungApi.Controllers;

[ApiController]
[Route("api/thanh-toan")]
[Authorize]
public class ThanhToanController : ControllerBase
{
    private readonly AppDbContext _db;

    public ThanhToanController(AppDbContext db)
    {
        _db = db;
    }

    // Thanh toan mot ky (gia lap cong thanh toan). Khach hang hoac nhan vien.
    [HttpPost]
    public async Task<IActionResult> ThanhToan(ThanhToanDto dto)
    {
        var lich = await _db.LichTras
            .Include(l => l.HopDong)!
            .ThenInclude(h => h!.KhachHang)
            .FirstOrDefaultAsync(l => l.Id == dto.LichTraId);

        if (lich == null) return NotFound(new { thongBao = "Không tìm thấy kỳ thanh toán" });
        if (lich.DaThanhToan) return BadRequest(new { thongBao = "Kỳ này đã thanh toán" });

        var hd = lich.HopDong!;

        // Kiem tra quyen: khach hang chi tra hop dong cua minh
        if (this.LayVaiTro() == "KhachHang" && hd.KhachHangId != this.LayKhachHangId())
            return Forbid();

        var now = DateTime.Now;
        lich.DaThanhToan = true;
        lich.NgayThanhToan = now;

        decimal soTien = lich.SoTienGoc + lich.SoTienLai;

        // Ghi nhan giao dich thu no (tien vao)
        _db.GiaoDichs.Add(new GiaoDich
        {
            HopDongId = hd.Id,
            SoTien = soTien,
            LoaiGiaoDich = LoaiGiaoDich.ThuNo,
            GhiChu = $"Thanh toán kỳ {lich.KyThu} (gốc {lich.SoTienGoc:N0} + lãi {lich.SoTienLai:N0})"
        });

        // Giam du no goc
        hd.DuNoConLai -= lich.SoTienGoc;
        if (hd.DuNoConLai < 0) hd.DuNoConLai = 0;

        // Cap nhat trang thai hop dong
        if (hd.DuNoConLai <= 0)
            hd.TrangThai = TrangThaiHopDong.TatToan;
        else if (hd.TrangThai == TrangThaiHopDong.DaGiaiNgan)
            hd.TrangThai = TrangThaiHopDong.DangVay;

        // Cap nhat diem CIC: tra dung han (truoc/dung ngay den han) -> +5
        var kh = hd.KhachHang!;
        if (lich.NgayThanhToan.Value.Date <= lich.NgayDenHan.Date)
        {
            int diemCu = kh.DiemCIC;
            kh.DiemCIC = Math.Min(700, kh.DiemCIC + 5);
            _db.LichSuCICs.Add(new LichSuCIC
            {
                KhachHangId = kh.Id,
                DiemCu = diemCu,
                DiemMoi = kh.DiemCIC,
                LyDo = $"Thanh toán đúng hạn kỳ {lich.KyThu} (+5)"
            });
        }

        await _db.SaveChangesAsync();

        return Ok(new
        {
            thongBao = "Thanh toán thành công",
            bienLai = new
            {
                maGiaoDich = $"BL{now:yyyyMMddHHmmss}",
                kyThu = lich.KyThu,
                soTien,
                thoiGian = now,
                hopDongId = hd.Id,
                tenKhachHang = kh.HoTen,
                duNoConLai = hd.DuNoConLai
            }
        });
    }

    // Lich su giao dich cua khach hang dang dang nhap
    [HttpGet("lich-su")]
    [Authorize(Roles = "KhachHang")]
    public async Task<IActionResult> LichSuCuaToi()
    {
        var khId = this.LayKhachHangId();
        var ds = await _db.GiaoDichs
            .Where(g => g.HopDong!.KhachHangId == khId)
            .OrderByDescending(g => g.ThoiGian)
            .Select(g => new
            {
                g.Id, g.HopDongId, g.SoTien, g.ThoiGian,
                loaiGiaoDich = g.LoaiGiaoDich.ToString(), g.GhiChu
            })
            .ToListAsync();
        return Ok(ds);
    }
}
