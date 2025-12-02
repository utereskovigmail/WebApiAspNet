
using Microsoft.AspNetCore.Http;

namespace Core.Models.Identity;

public class RegisterModel
{
    public string Email { get; set; }
    public string Password { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    
    public IFormFile Image { get; set; }
}