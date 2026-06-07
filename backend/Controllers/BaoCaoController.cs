using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinDungApi.Data;
using TinDungApi.Models;
using TinDungApi.Services;

namespace TinDungApi.Controllers;

[ApiController]
[Route("api/bao-cao")]
[Authorize(Roles = "Admin,NhanVien")]
public class BaoCaoController : ControllerBase
{
    private readonly AppDbContext _db;

    public BaoCaoController(AppDbContext db)
    {
        _db = db;
    }

    // Bang dieu khien tong quan
    [HttpGet("tong-quan")]
    public async Task<IActionResult> TongQuan()
    {
        var hopDongs = await _db.HopDongs.Include(h => h.KhachHang).ToListAsync();
        var dauThang = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

        decimal tongDuNo = hopDongs.Sum(h => h.DuNoConLai);

        // No xau: du no cua cac khach hang thuoc nhom no xau (CIC < 600 -> nhom 5)
        decimal duNoXau = hopDongs
            .Where(h => NghiepVu.NhomNo(h.KhachHang!.DiemCIC) >= 5)
            .Sum(h => h.DuNoConLai);

        decimal tyLeNoXau = tongDuNo > 0 ? Math.Round(duNoXau / tongDuNo * 100, 2) : 0;

        return Ok(new
        {
            tongDuNo,
            tyLeNoXau,
            soHopDongMoiThangNay = hopDongs.Count(h => h.NgayTao >= dauThang),
            tongSoHopDong = hopDongs.Count,
            soHopDongDangVay = hopDongs.Count(h =>
                h.TrangThai == TrangThaiHopDong.DangVay || h.TrangThai == TrangThaiHopDong.DaGiaiNgan),
            soHopDongChoDuyet = hopDongs.Count(h => h.TrangThai == TrangThaiHopDong.ChoDuyet),
            soKhachHang = await _db.KhachHangs.CountAsync()
        });
    }
}
