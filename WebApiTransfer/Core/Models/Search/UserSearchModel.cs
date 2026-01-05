public class UserSearchModel
{
    public string? Query { get; set; }        // email, name
    public string? Role { get; set; }         // Admin, User
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}