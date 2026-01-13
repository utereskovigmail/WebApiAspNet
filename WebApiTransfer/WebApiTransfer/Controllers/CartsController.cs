using Core.Interfaces;
using Core.Models.Cart;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiTransfer.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class CartsController(ICartService cartService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            var result = await cartService.GetListAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddUpdate([FromBody] CartAddUpdateModel model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model));

            if (model.TransportationId == null)
                throw new ArgumentException("TransportationId is required");

            if (model.Quantity <= 0)
                throw new ArgumentException("Quantity must be greater than 0");
            await cartService.AddUpdateAsync(model);
            return Ok();
        }
    }
}