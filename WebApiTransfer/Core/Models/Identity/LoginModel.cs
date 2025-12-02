namespace Core.Models.Identity;

public class LoginModel
{
    /// <summary>
    /// Emain
    /// </summary>
    /// <example>admin@gmail.com</example>
    public string Email { get; set; } = null!;
    /// <summary>
    /// Password
    /// </summary>
    /// <example>Admin123</example>
    public string Password { get; set; } = null!;
}