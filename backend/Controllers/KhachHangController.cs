using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinDungApi.Data;
using TinDungApi.Dtos;
using TinDungApi.Models;
using TinDungApi.Services;

namespace TinDungApi.Controllers;

[ApiController]
[Route("api/khach-hang")]
[Authorize]
public class KhachHangController : ControllerBase
{
    private readonly AppDbContext _db;

    public KhachHangController(AppDbContext db)
    {
        _db = db;
    }

    // Danh sach khach hang (Admin/NhanVien)
    [HttpGet]
    [Authorize(Roles = "Admin,NhanVien")]
    public async Task<IActionResult> DanhSach()
    {
        var ds = await _db.KhachHangs
            .OrderByDescending(k => k.Id)
            .Select(k => new
            {
                k.Id, k.HoTen, k.Email, k.SDT, k.DiaChi, k.CCCD, k.DiemCIC, k.NgayTao,
                nhomNo = NghiepVu.NhomNo(k.DiemCIC),
                soHopDong = k.HopDongs.Count
            })
            .ToListAsync();
        return Ok(ds);
    }

    // Chi tiet mot khach hang (Admin/NhanVien hoac chinh khach hang do)
    [HttpGet("{id}")]
    public async Task<IActionResult> ChiTiet(int id)
    {
        if (!CoQuyenXem(id)) return Forbid();

        var k = await _db.KhachHangs.FindAsync(id);
        if (k == null) return NotFound();

        var nhom = NghiepVu.NhomNo(k.DiemCIC);
        return Ok(new
        {
            k.Id, k.HoTen, k.Email, k.SDT, k.DiaChi, k.CCCD, k.DiemCIC, k.NgayTao,
            nhomNo = nhom,
            tenNhomNo = NghiepVu.TenNhomNo(nhom)
        });
    }

    // Lich su bien dong diem CIC
    [HttpGet("{id}/lich-su-cic")]
    public async Task<IActionResult> LichSuCic(int id)
    {
        if (!CoQuyenXem(id)) return Forbid();

        var ds = await _db.LichSuCICs
            .Where(l => l.KhachHangId == id)
            .OrderByDescending(l => l.ThoiGian)
            .Select(l => new { l.Id, l.DiemCu, l.DiemMoi, l.LyDo, l.ThoiGian })
            .ToListAsync();
        return Ok(ds);
    }

    // Cap nhat thong tin KYC (Admin/NhanVien)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,NhanVien")]
    public async Task<IActionResult> CapNhat(int id, KhachHangDto dto)
    {
        var k = await _db.KhachHangs.FindAsync(id);
        if (k == null) return NotFound();

        k.HoTen = dto.HoTen;
        k.Email = dto.Email;
        k.SDT = dto.SDT;
        k.DiaChi = dto.DiaChi;
        k.CCCD = dto.CCCD;

        this.GhiLog(_db, "Cập nhật KYC", $"Khách hàng #{id}", $"Cập nhật thông tin khách hàng {k.HoTen}");
        await _db.SaveChangesAsync();
        return Ok(new { thongBao = "Cập nhật thành công" });
    }

    private bool CoQuyenXem(int khachHangId)
    {
        var vaiTro = this.LayVaiTro();
        if (vaiTro == "Admin" || vaiTro == "NhanVien") return true;
        return this.LayKhachHangId() == khachHangId;
    }
}
