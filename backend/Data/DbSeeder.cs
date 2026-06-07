using TinDungApi.Models;

namespace TinDungApi.Data;

// Khoi tao du lieu mac dinh: tai khoan ADMIN / 12345
public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        db.Database.EnsureCreated();

        if (!db.TaiKhoans.Any(t => t.TenDangNhap == "ADMIN"))
        {
            db.TaiKhoans.Add(new TaiKhoan
            {
                TenDangNhap = "ADMIN",
                Email = "admin@tindung.vn",
                MatKhauHash = BCrypt.Net.BCrypt.HashPassword("12345"),
                VaiTro = VaiTro.Admin,
                DangHoatDong = true
            });
            db.SaveChanges();
        }
    }
}
