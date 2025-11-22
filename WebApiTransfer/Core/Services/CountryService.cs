using AutoMapper;
using Core.Interfaces;
using Core.Models.Location;
using Domain;
using Domain.Entities.Location;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class CountryService(IMapper mapper,
    AppDbTransferContext context, IImageService imageService) : ICountryService
{
    public async Task<List<CountryItemModel>> GetListAsync()
    {
        var countryList = await context.Countries.ToListAsync();
        var countryItems = mapper.Map<List<CountryItemModel>>(countryList);
        return countryItems;
    }

    public async Task<CountryItemModel> CreateAsync(CountryCreateModel model)
    {
        var entity = mapper.Map<CountryEntity>(model);
        if (model.Image != null)
        {
            entity.Image = await imageService.UploadImageAsync(model.Image);
        }
        await context.Countries.AddAsync(entity);
        await context.SaveChangesAsync();
        var item = mapper.Map<CountryItemModel>(entity);
        return item;
    }
}