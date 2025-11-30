using Core.Models.Identity;
using Core.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebApiTransfer.Controllers;

public class EntityController(UserManager<UserEntity> manager,
    JwtTokenService jwtTokenService)
    :ControllerBase
{
    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        GoogleJsonWebSignature.Payload payload;

        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(dto.idToken);
        }
        catch (Exception ex)
        {
            return Unauthorized("Invalid Google token");
        }

        // payload.Email
        // payload.GivenName
        // payload.FamilyName
        // payload.Picture
        // payload.Subject (унікальний Google ID)

        var user = await manager.FindByEmailAsync(payload.Email);

        if (user == null)
        {
            user = new UserEntity
            {
                Email = payload.Email,
                UserName = payload.Email,
                FirstName = payload.GivenName,
                LastName = payload.FamilyName,
                Image = payload.Picture
            };

            await manager.CreateAsync(user);
        }

        var jwt = jwtTokenService.CreateToken(user);

        return Ok(new { token = jwt });
    }
}