using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinDungApi.Data;

namespace TinDungApi.Controllers;

[ApiController]
[Route("api/audit-log")]
[Authorize(Roles = "Admin")]
public class AuditLogController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuditLogController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> DanhSach()
    {
        var ds = await _db.AuditLogs
            .OrderByDescending(a => a.ThoiGian)
            .Take(200)
            .Select(a => new
            {
                a.Id, a.NguoiThucHien, a.HanhDong, a.DoiTuong, a.ChiTiet, a.ThoiGian
            })
            .ToListAsync();
        return Ok(ds);
    }
}
