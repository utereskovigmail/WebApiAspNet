using System.Net.Http.Headers;
using System.Text.Json;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Account;
using Core.Models.Identity;
using Core.Models.Location.City;
using Core.SMTP;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Core.Services;

public class UserService(IAuthService authService, 
    AppDbTransferContext transferContext,
    IConfiguration configuration,
    UserManager<UserEntity> userManager,
    ISmtpService smtpService,
    JwtTokenService tokenService,
    IImageService imageService,
    IMapper mapper) : IUserService
{
    public async Task<bool> ForgotPasswordAsync(ForgotPasswordModel model)
    {
        var user = await userManager.FindByEmailAsync(model.Email);

        if (user == null)
        {
            return false;
        }

        string token = await userManager.GeneratePasswordResetTokenAsync(user);
        Console.WriteLine("token - " + token);
        var resetLink = $"{configuration["ClientUrl"]}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(model.Email)}";

        var emailModel = new EmailMessage
        {
            To = model.Email,
            Subject = "Password Reset",
            Body = $"<p>Click the link below to reset your password:</p><a href='{resetLink}'>Reset Password</a>"
        };

        var result = smtpService.SendEmail(emailModel);

        return result;
    }

    public async Task<UserProfileModel> GetUserProfileAsync()
    {
        var userId = await authService.GetUserIdAsync();
        
        var profile = await transferContext.Users
            .ProjectTo<UserProfileModel>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(u => u.Id == userId!);

        return profile!;
    }

    public async Task<PagedResult<UserListItemModel>> SearchUsersAsync(UserSearchModel model)
    {
        var page = model.Page < 1 ? 1 : model.Page;
        var pageSize = model.PageSize is < 1 or > 100 ? 10 : model.PageSize;

        var query = transferContext.Users
            .AsNoTracking()
            .OrderBy(u => u.Email)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(model.Query))
        {
            var q = model.Query.ToLower();
            query = query.Where(u =>
                u.Email!.ToLower().Contains(q) ||
                (u.FirstName + " " + u.LastName).ToLower().Contains(q));
        }

        if (!string.IsNullOrWhiteSpace(model.Role))
        {
            query = query.Where(u =>
                u.UserRoles.Any(r => r.Role.Name == model.Role));
        }

        var total = await query.CountAsync();

        var users = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserListItemModel
            {
                Id = u.Id.ToString(),
                Email = u.Email!,
                FullName = u.FirstName + " " + u.LastName,
                Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
            })
            .ToListAsync();

        return new PagedResult<UserListItemModel>(users, total);

    }
    
    
    public async Task<string> LoginByGoogle(string token)
    {
        using var httpClient = new HttpClient();

        httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        //configuration
        string userInfo = configuration["GoogleUserInfo"] ?? "https://www.googleapis.com/oauth2/v2/userinfo";
        var response = await httpClient.GetAsync(userInfo);

        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync();

        var googleUser = JsonSerializer.Deserialize<GoogleAccountModel>(json);

        var existingUser = await userManager.FindByEmailAsync(googleUser!.Email);
        if (existingUser != null)
        {
            var userLoginGoogle = await userManager.FindByLoginAsync("Google", googleUser.GogoleId);

            if (userLoginGoogle == null)
            {
                await userManager.AddLoginAsync(existingUser, new UserLoginInfo("Google", googleUser.GogoleId, "Google"));
            }
            var jwtToken = await tokenService.CreateToken(existingUser);
            return jwtToken;
        }
        else
        {
            var user = mapper.Map<UserEntity>(googleUser);

            if (!String.IsNullOrEmpty(googleUser.Picture))
            {
                user.Image = await imageService.SaveImageFromUrlAsync(googleUser.Picture);
            }

            var result = await userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                result = await userManager.AddLoginAsync(user, new UserLoginInfo(
                    loginProvider: "Google",
                    providerKey: googleUser.GogoleId,
                    displayName: "Google"
                ));

                await userManager.AddToRoleAsync(user, "User");
                var jwtToken = await tokenService.CreateToken(user);
                return jwtToken;
            }
        }

        return string.Empty;
    }
    
    
}