using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using TinDungApi.Data;
using TinDungApi.Models;

namespace TinDungApi.Services;

// Cac ham tien ich dung trong controller: lay thong tin nguoi dung tu token, ghi audit log
public static class ControllerHelpers
{
    public static int LayTaiKhoanId(this ControllerBase c)
    {
        var s = c.User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(s, out var id) ? id : 0;
    }

    public static string LayTenDangNhap(this ControllerBase c)
        => c.User.FindFirstValue(ClaimTypes.Name) ?? "";

    public static string LayVaiTro(this ControllerBase c)
        => c.User.FindFirstValue(ClaimTypes.Role) ?? "";

    public static int? LayKhachHangId(this ControllerBase c)
    {
        var s = c.User.FindFirstValue("KhachHangId");
        return int.TryParse(s, out var id) ? id : null;
    }

    // Ghi mot dong audit log
    public static void GhiLog(this ControllerBase c, AppDbContext db, string hanhDong, string doiTuong, string chiTiet)
    {
        db.AuditLogs.Add(new AuditLog
        {
            TaiKhoanId = c.LayTaiKhoanId(),
            NguoiThucHien = c.LayTenDangNhap(),
            HanhDong = hanhDong,
            DoiTuong = doiTuong,
            ChiTiet = chiTiet,
            ThoiGian = DateTime.Now
        });
    }
}
