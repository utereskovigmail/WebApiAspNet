using System.Security.Claims;
using Core.Interfaces;
using Core.Mappers;
using Core.Models.Identity;
using Core.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApiTransfer.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]

public class EntityController(UserManager<UserEntity> manager,     
    IUserService userService,
    JwtTokenService jwtTokenService,
    IImageService imageService,
    RoleManager<RoleEntity> roleManager
    )
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
        
        if (!await roleManager.RoleExistsAsync("User"))
        {
            await roleManager.CreateAsync(new RoleEntity { Name = "User" });
        }
        await manager.AddToRoleAsync(entity, "User");

        var token = await jwtTokenService.CreateToken(entity);
        

        
        return Ok(new { token });
    }
    
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return Unauthorized();

        var user = await manager.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == int.Parse(userId));


        if (user == null)
            return Unauthorized();

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            image = user.Image,
            roles = user.UserRoles.Select(x => x.Role.Name)
        });
    }
    
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public IActionResult GetAdminData()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        return Ok();
    }
    
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Ok(userId);
    }
    
    [HttpPost]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
    {
        bool res = await userService.ForgotPasswordAsync(model);
        if (res)
            return Ok();
        else
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Email = "no user with such an email" }
            });
    }
    
    [HttpPost]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
    {
        var user = await manager.FindByEmailAsync(model.Email);
        if (user == null) return BadRequest("Invalid email");

        var result = await manager.ResetPasswordAsync(user, model.Token, model.NewPassword);

        if (!result.Succeeded)
            return BadRequest(string.Join(", ", result.Errors.Select(e => e.Description)));

        return Ok("Password reset successfully");
    }


    
    
    

}