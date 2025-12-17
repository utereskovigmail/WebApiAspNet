using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Location.City;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApiTransfer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController(ICityService cityService, AppDbTransferContext context, IMapper mapper) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetListAsync()
        {
            var list = await cityService.GetListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var cities = await context.Cities.Where(c => c.Country.Id == id)
                .ProjectTo<CityItemModel>(mapper.ConfigurationProvider)
                    .ToListAsync();
            return Ok(cities);
        }

        [HttpPost("Create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAsync([FromForm] CityCreateModel model)
        {
            var item = await cityService.CreateAsync(model);
            return Ok(item);
        }

        // [HttpGet("countriesbyid")]
        // public async Task<IActionResult> GetCountriesByIdAsync(int id)
        // {
        //     var city = await context.Cities.FindAsync(id);
        //     var countries = city.
        // }
    }
}