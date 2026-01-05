using AutoMapper;
using Core.Interfaces;
using Core.Models.Location;
using Domain;
using Domain.Entities.Location;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiTransfer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CountriesController(
    AppDbTransferContext context,
    ICountryService countryService,
    IMapper mapper, IImageService imageService
    ) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetCountries()
    {
        return Ok(await countryService.GetListAsync());
    }
    
    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCountry([FromForm] CountryGeneralModel model)
    {
        var item = await countryService.CreateAsync(model);

        return Ok(item);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await context.Countries.FindAsync(id);
        if (item == null) return NotFound();
        var model = mapper.Map<CountryGeneralModel>(item);
        
        return Ok(model);
    }
    
    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        if (await countryService.DeleteAsync(id)) return Ok();
        else{return NotFound();}

    }
    [HttpPut("edit/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> EditAsync(int id, [FromForm] CountryGeneralModel model)
    {
        var res = await countryService.EditAsync(model);
        if (res) return Ok();
        else
        {
            return NotFound();
        }
    }
    
    
}
