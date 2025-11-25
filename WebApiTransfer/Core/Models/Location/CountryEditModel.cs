using Microsoft.AspNetCore.Http;

namespace Core.Models.Location;

public class CountryEditModel
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string ShortDescription { get; set; } = null!;
    
    public List<string> Tags { get; set; } = null!;
    public IFormFile? Image { get; set; }
}