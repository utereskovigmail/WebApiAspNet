using Core.Interfaces;
using Core.Mappers;
using Core.Models.Identity;
using Core.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebApiTransfer.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]

public class EntityController(UserManager<UserEntity> manager,
    JwtTokenService jwtTokenService,
    IImageService imageService)
    :ControllerBase
{
    [HttpPost]
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

        var jwt = await jwtTokenService.CreateToken(user);

        return Ok(new { token = jwt });
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await manager.FindByEmailAsync(model.Email);
        if (user == null || !await manager.CheckPasswordAsync(user, model.Password))
        {
            return Unauthorized("Invalid username or password");
        }
        var token = await jwtTokenService.CreateToken(user);
        
        return Ok(new { token });
    }

    [HttpPost]
    public async Task<IActionResult> Register(RegisterModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var entity = new UserEntity
        {
            Email = model.Email,
            UserName = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
        };
        if (model.Image != null)
        {
            entity.Image = await imageService.UploadImageAsync(model.Image);
        }

        var result = await manager.CreateAsync(entity, model.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        var token = jwtTokenService.CreateToken(entity);
        return Ok(new { token });
    }
}