using System.Security.Claims;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Core.Services;

public class AuthService(IHttpContextAccessor httpContextAccessor,
    UserManager<UserEntity> userManager) 
    : IAuthService
{
    public async Task<int> GetUserIdAsync()
    {
        var httpContext = httpContextAccessor.HttpContext
                          ?? throw new UnauthorizedAccessException("No HttpContext.");

        var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            throw new UnauthorizedAccessException("User is not authenticated.");

        return int.Parse(userIdClaim.Value);
    }
}