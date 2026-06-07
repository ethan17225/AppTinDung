using Microsoft.EntityFrameworkCore;
using TinDungApi.Models;

namespace TinDungApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<KhachHang> KhachHangs => Set<KhachHang>();
    public DbSet<TaiKhoan> TaiKhoans => Set<TaiKhoan>();
    public DbSet<HopDong> HopDongs => Set<HopDong>();
    public DbSet<LichTra> LichTras => Set<LichTra>();
    public DbSet<GiaoDich> GiaoDichs => Set<GiaoDich>();
    public DbSet<LichSuCIC> LichSuCICs => Set<LichSuCIC>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Kieu tien te dung decimal(18,2)
        modelBuilder.Entity<HopDong>().Property(h => h.HanMuc).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<HopDong>().Property(h => h.LaiSuat).HasColumnType("decimal(9,2)");
        modelBuilder.Entity<HopDong>().Property(h => h.DuNoConLai).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<LichTra>().Property(l => l.SoTienGoc).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<LichTra>().Property(l => l.SoTienLai).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<GiaoDich>().Property(g => g.SoTien).HasColumnType("decimal(18,2)");

        // Email tai khoan la duy nhat
        modelBuilder.Entity<TaiKhoan>().HasIndex(t => t.TenDangNhap).IsUnique();
    }
}
