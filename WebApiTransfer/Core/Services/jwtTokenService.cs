using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Core.Services;
public class JwtTokenService
{
    private readonly IConfiguration _config;
    private readonly UserManager<UserEntity> _manager;

    public JwtTokenService(IConfiguration config, UserManager<UserEntity> manager)
    {
        _config = config;
        _manager = manager;
    }

    public async Task<string> CreateToken(UserEntity user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? "")
        };

        // Add custom profile fields
        if (!string.IsNullOrEmpty(user.FirstName))
            claims.Add(new Claim("firstName", user.FirstName));

        if (!string.IsNullOrEmpty(user.LastName))
            claims.Add(new Claim("lastName", user.LastName));

        if (!string.IsNullOrEmpty(user.Image))
            claims.Add(new Claim("image", user.Image));
        
        foreach (var role in (await _manager.GetRolesAsync(user)))
        {
            claims.Add(new Claim("roles", role));
        }

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(3),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}