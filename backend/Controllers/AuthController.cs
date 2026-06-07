using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinDungApi.Data;
using TinDungApi.Dtos;
using TinDungApi.Models;
using TinDungApi.Services;

namespace TinDungApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;

    public AuthController(AppDbContext db, JwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    // Dang nhap
    [HttpPost("dang-nhap")]
    public async Task<IActionResult> DangNhap(DangNhapDto dto)
    {
        var tk = await _db.TaiKhoans
            .Include(t => t.KhachHang)
            .FirstOrDefaultAsync(t => t.TenDangNhap == dto.TenDangNhap);

        if (tk == null || !BCrypt.Net.BCrypt.Verify(dto.MatKhau, tk.MatKhauHash))
            return BadRequest(new { thongBao = "Tài khoản hoặc mật khẩu không đúng" });

        if (!tk.DangHoatDong)
            return BadRequest(new { thongBao = "Tài khoản đã bị khóa" });

        return Ok(new AuthResultDto
        {
            Token = _jwt.TaoToken(tk),
            TaiKhoanId = tk.Id,
            TenDangNhap = tk.TenDangNhap,
            VaiTro = tk.VaiTro.ToString(),
            KhachHangId = tk.KhachHangId,
            HoTen = tk.KhachHang?.HoTen ?? tk.TenDangNhap
        });
    }

    // Dang ky tai khoan moi (chi danh cho khach hang)
    [HttpPost("dang-ky")]
    public async Task<IActionResult> DangKy(DangKyDto dto)
    {
        if (await _db.TaiKhoans.AnyAsync(t => t.TenDangNhap == dto.Email))
            return BadRequest(new { thongBao = "Email đã được đăng ký" });

        var kh = new KhachHang
        {
            HoTen = dto.HoTen,
            Email = dto.Email,
            SDT = dto.SDT,
            DiaChi = dto.DiaChi,
            CCCD = dto.CCCD,
            DiemCIC = 650
        };
        _db.KhachHangs.Add(kh);
        await _db.SaveChangesAsync();

        // Lich su CIC khoi tao
        _db.LichSuCICs.Add(new LichSuCIC
        {
            KhachHangId = kh.Id,
            DiemCu = 650,
            DiemMoi = 650,
            LyDo = "Khởi tạo điểm CIC cho khách hàng mới"
        });

        var tk = new TaiKhoan
        {
            TenDangNhap = dto.Email,
            Email = dto.Email,
            MatKhauHash = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
            VaiTro = VaiTro.KhachHang,
            KhachHangId = kh.Id
        };
        _db.TaiKhoans.Add(tk);
        await _db.SaveChangesAsync();

        return Ok(new AuthResultDto
        {
            Token = _jwt.TaoToken(tk),
            TaiKhoanId = tk.Id,
            TenDangNhap = tk.TenDangNhap,
            VaiTro = tk.VaiTro.ToString(),
            KhachHangId = kh.Id,
            HoTen = kh.HoTen
        });
    }

    // Quen mat khau: gia lap gui ma xac nhan (tra ve truc tiep de demo)
    [HttpPost("quen-mat-khau")]
    public async Task<IActionResult> QuenMatKhau(QuenMatKhauDto dto)
    {
        var tk = await _db.TaiKhoans.FirstOrDefaultAsync(t => t.Email == dto.Email);
        if (tk == null)
            return BadRequest(new { thongBao = "Không tìm thấy tài khoản với email này" });

        // Tao ma 6 so
        var ma = new Random().Next(100000, 999999).ToString();
        tk.MaXacNhan = ma;
        await _db.SaveChangesAsync();

        // Gia lap email: tra ma ve cho client (demo). Thuc te se gui qua SMTP.
        return Ok(new
        {
            thongBao = "Mã xác nhận đã được gửi (giả lập). Vui lòng dùng mã bên dưới để đặt lại mật khẩu.",
            maXacNhan = ma
        });
    }

    // Dat lai mat khau bang ma xac nhan
    [HttpPost("dat-lai-mat-khau")]
    public async Task<IActionResult> DatLaiMatKhau(DatLaiMatKhauDto dto)
    {
        var tk = await _db.TaiKhoans.FirstOrDefaultAsync(t => t.Email == dto.Email);
        if (tk == null || string.IsNullOrEmpty(tk.MaXacNhan) || tk.MaXacNhan != dto.MaXacNhan)
            return BadRequest(new { thongBao = "Mã xác nhận không đúng" });

        tk.MatKhauHash = BCrypt.Net.BCrypt.HashPassword(dto.MatKhauMoi);
        tk.MaXacNhan = null;
        await _db.SaveChangesAsync();

        return Ok(new { thongBao = "Đổi mật khẩu thành công" });
    }
}
