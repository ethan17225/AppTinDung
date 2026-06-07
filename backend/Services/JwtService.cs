using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TinDungApi.Models;

namespace TinDungApi.Services;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string TaoToken(TaiKhoan tk)
    {
        var key = _config["Jwt:Key"]!;
        var issuer = _config["Jwt:Issuer"];
        var audience = _config["Jwt:Audience"];
        var hours = int.Parse(_config["Jwt:ExpireHours"] ?? "8");

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, tk.Id.ToString()),
            new(ClaimTypes.Name, tk.TenDangNhap),
            new(ClaimTypes.Role, tk.VaiTro.ToString())
        };
        if (tk.KhachHangId.HasValue)
            claims.Add(new Claim("KhachHangId", tk.KhachHangId.Value.ToString()));

        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.Now.AddHours(hours),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
