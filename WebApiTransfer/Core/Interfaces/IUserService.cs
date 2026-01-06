using Core.Models.Account;
using Core.Models.Identity;

namespace Core.Interfaces;

public interface IUserService
{
    Task<UserProfileModel> GetUserProfileAsync();
    public Task<bool> ForgotPasswordAsync(ForgotPasswordModel model);
    Task<PagedResult<UserListItemModel>> SearchUsersAsync(UserSearchModel model);
    public Task<string> LoginByGoogle(string token);
}