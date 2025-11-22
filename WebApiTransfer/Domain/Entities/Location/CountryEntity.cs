using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Location;

[Table("tblCountries")]
public class CountryEntity : BaseEntity<int>
{
    [StringLength(250)]
    public string Name { get; set; } = null!;
    [StringLength(10)]
    public string Code { get; set; } = null!;
    [StringLength(250)]
    public string Slug { get; set; } = null!;
    [StringLength(2500)]
    public string Description { get; set; } = null!;
    [StringLength(750)]
    public string ShortDescription { get; set; } = null!;
    
    public List<string> Tags { get; set; } = new List<string>();
    public string? Image { get; set; } 
    
    
}
