using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinDungApi.Data;
using TinDungApi.Dtos;
using TinDungApi.Models;
using TinDungApi.Services;

namespace TinDungApi.Controllers;

// Quan ly tai khoan - chi danh cho Admin
[ApiController]
[Route("api/tai-khoan")]
[Authorize(Roles = "Admin")]
public class TaiKhoanController : ControllerBase
{
    private readonly AppDbContext _db;

    public TaiKhoanController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> DanhSach()
    {
        var ds = await _db.TaiKhoans
            .OrderBy(t => t.Id)
            .Select(t => new
            {
                t.Id, t.TenDangNhap, t.Email,
                vaiTro = t.VaiTro.ToString(),
                t.DangHoatDong, t.NgayTao, t.KhachHangId
            })
            .ToListAsync();
        return Ok(ds);
    }

    // Danh sach nhan vien tin dung (de gan ho so)
    [HttpGet("nhan-vien")]
    public async Task<IActionResult> DanhSachNhanVien()
    {
        var ds = await _db.TaiKhoans
            .Where(t => t.VaiTro == VaiTro.NhanVien || t.VaiTro == VaiTro.Admin)
            .Select(t => new { t.Id, t.TenDangNhap, vaiTro = t.VaiTro.ToString() })
            .ToListAsync();
        return Ok(ds);
    }

    [HttpPost]
    public async Task<IActionResult> Tao(TaoTaiKhoanDto dto)
    {
        if (await _db.TaiKhoans.AnyAsync(t => t.TenDangNhap == dto.TenDangNhap))
            return BadRequest(new { thongBao = "Tên đăng nhập đã tồn tại" });

        if (!Enum.TryParse<VaiTro>(dto.VaiTro, out var vaiTro))
            return BadRequest(new { thongBao = "Vai trò không hợp lệ" });

        var tk = new TaiKhoan
        {
            TenDangNhap = dto.TenDangNhap,
            Email = dto.Email,
            MatKhauHash = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
            VaiTro = vaiTro,
            DangHoatDong = true
        };
        _db.TaiKhoans.Add(tk);
        this.GhiLog(_db, "Tạo tài khoản", $"Tài khoản {dto.TenDangNhap}", $"Vai trò {dto.VaiTro}");
        await _db.SaveChangesAsync();
        return Ok(new { tk.Id, thongBao = "Tạo tài khoản thành công" });
    }

    // Khoa / mo khoa tai khoan
    [HttpPost("{id}/doi-trang-thai")]
    public async Task<IActionResult> DoiTrangThai(int id)
    {
        var tk = await _db.TaiKhoans.FindAsync(id);
        if (tk == null) return NotFound();
        tk.DangHoatDong = !tk.DangHoatDong;
        this.GhiLog(_db, "Đổi trạng thái tài khoản", $"Tài khoản #{id}",
            tk.DangHoatDong ? "Mở khóa" : "Khóa");
        await _db.SaveChangesAsync();
        return Ok(new { thongBao = "Cập nhật trạng thái thành công", tk.DangHoatDong });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Xoa(int id)
    {
        var tk = await _db.TaiKhoans.FindAsync(id);
        if (tk == null) return NotFound();
        if (tk.TenDangNhap == "ADMIN")
            return BadRequest(new { thongBao = "Không thể xóa tài khoản ADMIN gốc" });

        _db.TaiKhoans.Remove(tk);
        this.GhiLog(_db, "Xóa tài khoản", $"Tài khoản #{id}", tk.TenDangNhap);
        await _db.SaveChangesAsync();
        return Ok(new { thongBao = "Đã xóa tài khoản" });
    }
}
