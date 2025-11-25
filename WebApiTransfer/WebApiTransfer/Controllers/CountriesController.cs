using AutoMapper;
using Core.Interfaces;
using Core.Models.Location;
using Domain;
using Domain.Entities.Location;
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
    
    [HttpPost]
    public async Task<IActionResult> CreateCountry([FromForm] CountryCreateModel model)
    {
        var item = await countryService.CreateAsync(model);

        return CreatedAtAction(null, item);
    }
    
    [HttpPost]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        if (await countryService.DeleteAsync(id)) return Ok();
        else{return NotFound();}

    }
    [HttpPost]
    public async Task<IActionResult> EditAsync([FromForm] CountryEditModel model)
    {
        var res = await countryService.EditAsync(model);
        if (res) return Ok();
        else
        {
            return NotFound();
        }
    }
    
    
}
