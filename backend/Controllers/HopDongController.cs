using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinDungApi.Data;
using TinDungApi.Dtos;
using TinDungApi.Models;
using TinDungApi.Services;

namespace TinDungApi.Controllers;

[ApiController]
[Route("api/hop-dong")]
[Authorize]
public class HopDongController : ControllerBase
{
    private readonly AppDbContext _db;

    public HopDongController(AppDbContext db)
    {
        _db = db;
    }

    // Danh sach hop dong (loc theo vai tro)
    [HttpGet]
    public async Task<IActionResult> DanhSach()
    {
        var query = _db.HopDongs.Include(h => h.KhachHang).AsQueryable();

        var vaiTro = this.LayVaiTro();
        if (vaiTro == "KhachHang")
        {
            var khId = this.LayKhachHangId();
            query = query.Where(h => h.KhachHangId == khId);
        }
        else if (vaiTro == "NhanVien")
        {
            // Nhan vien xem ho so duoc giao hoac chua gan
            var nvId = this.LayTaiKhoanId();
            query = query.Where(h => h.NhanVienId == null || h.NhanVienId == nvId);
        }

        var ds = await query
            .OrderByDescending(h => h.Id)
            .Select(h => new
            {
                h.Id, h.KhachHangId, tenKhachHang = h.KhachHang!.HoTen,
                h.HanMuc, h.KyHanThang, h.LaiSuat, h.MucDich,
                trangThai = h.TrangThai.ToString(), h.DuNoConLai,
                h.NgayTao, h.NgayGiaiNgan, h.NhanVienId
            })
            .ToListAsync();
        return Ok(ds);
    }

    // Chi tiet hop dong kem lich tra va giao dich
    [HttpGet("{id}")]
    public async Task<IActionResult> ChiTiet(int id)
    {
        var h = await _db.HopDongs
            .Include(x => x.KhachHang)
            .Include(x => x.LichTras)
            .Include(x => x.GiaoDichs)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (h == null) return NotFound();

        if (this.LayVaiTro() == "KhachHang" && h.KhachHangId != this.LayKhachHangId())
            return Forbid();

        return Ok(new
        {
            h.Id, h.KhachHangId, tenKhachHang = h.KhachHang!.HoTen,
            h.HanMuc, h.KyHanThang, h.LaiSuat, h.MucDich,
            trangThai = h.TrangThai.ToString(), h.DuNoConLai,
            h.NgayTao, h.NgayGiaiNgan, h.NhanVienId,
            lichTra = h.LichTras.OrderBy(l => l.KyThu).Select(l => new
            {
                l.Id, l.KyThu, l.NgayDenHan, l.SoTienGoc, l.SoTienLai,
                tongKy = l.SoTienGoc + l.SoTienLai,
                l.DaThanhToan, l.NgayThanhToan
            }),
            giaoDich = h.GiaoDichs.OrderByDescending(g => g.ThoiGian).Select(g => new
            {
                g.Id, g.SoTien, g.ThoiGian, loaiGiaoDich = g.LoaiGiaoDich.ToString(), g.GhiChu
            })
        });
    }

    // Nhan vien/Admin tao ho so vay cho khach hang
    [HttpPost]
    [Authorize(Roles = "Admin,NhanVien")]
    public async Task<IActionResult> Tao(TaoHopDongDto dto)
    {
        var kh = await _db.KhachHangs.FindAsync(dto.KhachHangId);
        if (kh == null) return BadRequest(new { thongBao = "Không tìm thấy khách hàng" });

        var hd = new HopDong
        {
            KhachHangId = dto.KhachHangId,
            HanMuc = dto.HanMuc,
            KyHanThang = dto.KyHanThang,
            LaiSuat = dto.LaiSuat,
            MucDich = dto.MucDich,
            TrangThai = TrangThaiHopDong.ChoDuyet,
            NhanVienId = this.LayTaiKhoanId()
        };
        _db.HopDongs.Add(hd);
        this.GhiLog(_db, "Tạo hồ sơ vay", "Hợp đồng", $"Tạo hồ sơ vay cho KH #{dto.KhachHangId}, hạn mức {dto.HanMuc}");
        await _db.SaveChangesAsync();
        return Ok(new { hd.Id, thongBao = "Tạo hồ sơ thành công" });
    }

    // Khach hang gui yeu cau vay moi
    [HttpPost("dang-ky-vay")]
    [Authorize(Roles = "KhachHang")]
    public async Task<IActionResult> DangKyVay(DangKyVayDto dto)
    {
        var khId = this.LayKhachHangId();
        if (khId == null) return BadRequest(new { thongBao = "Không xác định được khách hàng" });

        var hd = new HopDong
        {
            KhachHangId = khId.Value,
            HanMuc = dto.HanMuc,
            KyHanThang = dto.KyHanThang,
            LaiSuat = 12m, // lai suat mac dinh 12%/nam, nhan vien co the dieu chinh khi duyet
            MucDich = dto.MucDich,
            TrangThai = TrangThaiHopDong.ChoDuyet
        };
        _db.HopDongs.Add(hd);
        await _db.SaveChangesAsync();
        return Ok(new { hd.Id, thongBao = "Gửi yêu cầu vay thành công, vui lòng chờ duyệt" });
    }

    // Duyet & giai ngan ho so (Admin/NhanVien): ChoDuyet -> DaGiaiNgan
    [HttpPost("{id}/duyet")]
    [Authorize(Roles = "Admin,NhanVien")]
    public async Task<IActionResult> Duyet(int id)
    {
        var hd = await _db.HopDongs.FindAsync(id);
        if (hd == null) return NotFound();
        if (hd.TrangThai != TrangThaiHopDong.ChoDuyet)
            return BadRequest(new { thongBao = "Hồ sơ không ở trạng thái chờ duyệt" });

        hd.TrangThai = TrangThaiHopDong.DaGiaiNgan;
        hd.NgayGiaiNgan = DateTime.Now;
        hd.DuNoConLai = hd.HanMuc;
        if (hd.NhanVienId == null) hd.NhanVienId = this.LayTaiKhoanId();

        // Tao lich tra (du no giam dan)
        hd.LichTras = NghiepVu.TaoLichTra(hd);

        // Ghi nhan giao dich giai ngan (tien ra)
        _db.GiaoDichs.Add(new GiaoDich
        {
            HopDongId = hd.Id,
            SoTien = hd.HanMuc,
            LoaiGiaoDich = LoaiGiaoDich.GiaiNgan,
            GhiChu = "Giải ngân hợp đồng vay"
        });

        this.GhiLog(_db, "Duyệt & giải ngân", $"Hợp đồng #{id}", $"Giải ngân {hd.HanMuc} cho KH #{hd.KhachHangId}");
        await _db.SaveChangesAsync();
        return Ok(new { thongBao = "Duyệt và giải ngân thành công" });
    }

    // Tu choi ho so
    [HttpPost("{id}/tu-choi")]
    [Authorize(Roles = "Admin,NhanVien")]
    public async Task<IActionResult> TuChoi(int id)
    {
        var hd = await _db.HopDongs.FindAsync(id);
        if (hd == null) return NotFound();
        if (hd.TrangThai != TrangThaiHopDong.ChoDuyet)
            return BadRequest(new { thongBao = "Chỉ từ chối được hồ sơ chờ duyệt" });

        hd.TrangThai = TrangThaiHopDong.TuChoi;
        this.GhiLog(_db, "Từ chối hồ sơ", $"Hợp đồng #{id}", "Từ chối hồ sơ vay");
        await _db.SaveChangesAsync();
        return Ok(new { thongBao = "Đã từ chối hồ sơ" });
    }

    // Gan nhan vien phu trach (Admin)
    [HttpPost("{id}/gan-nhan-vien")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GanNhanVien(int id, GanNhanVienDto dto)
    {
        var hd = await _db.HopDongs.FindAsync(id);
        if (hd == null) return NotFound();

        hd.NhanVienId = dto.NhanVienId;
        this.GhiLog(_db, "Gán nhân viên", $"Hợp đồng #{id}", $"Gán nhân viên #{dto.NhanVienId}");
        await _db.SaveChangesAsync();
        return Ok(new { thongBao = "Gán nhân viên thành công" });
    }
}
