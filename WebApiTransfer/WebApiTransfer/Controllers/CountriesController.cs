using Core.Interfaces;
using Core.Models.Location;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace WebApiTransfer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CountriesController(
    AppDbTransferContext context,
    ICountryService countryService
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
        //return Created(item); //код 201
    }
    
    
}
