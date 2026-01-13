using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Cart;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class CartService(AppDbTransferContext appDbContext,
    IAuthService authService,
    IMapper mapper) : ICartService
{
    public async Task AddUpdateAsync(CartAddUpdateModel model)
    {
        var userId = await authService.GetUserIdAsync();
        var cartItem = appDbContext.Carts
            .SingleOrDefault(c => c.UserId == userId && 
                                  c.TransportationId == model.TransportationId);
        if (cartItem == null)
        {
            cartItem = new Domain.Entities.CartEntity
            {
                UserId = userId,
                TransportationId = model.TransportationId,
                CountTickets = model.Quantity
            };
            appDbContext.Carts.Add(cartItem);
        }
        else
        {
            cartItem.CountTickets = model.Quantity;
        }
        appDbContext.SaveChanges();
    }
    public async Task<List<CartItemModel>> GetListAsync()
    {
        var userId = await authService.GetUserIdAsync();
        var result = await appDbContext.Carts
            .Where(c => c.UserId == userId)
            .ProjectTo<CartItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        return result;
    }
}