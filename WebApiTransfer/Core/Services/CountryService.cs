using AutoMapper;
using Core.Interfaces;
using Core.Models.Location;
using Domain;
using Domain.Entities.Location;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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
    
    public async Task<bool> EditAsync(CountryEditModel model)
    {
        var existingEntity = await context.Countries.FindAsync(model.Id);

        if (existingEntity == null)
            return false;
        
        mapper.Map(model, existingEntity);
        
        existingEntity.IsDeleted = false;
        
        if (model.Image != null)
        {
            existingEntity.Image = await imageService.UploadImageAsync(model.Image);
        }

        await context.SaveChangesAsync();

        return true;
    }
    
    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await context.Countries.FindAsync(id);

        if (entity == null)
            return false;

        entity.IsDeleted = true;

        await context.SaveChangesAsync();

        return true;

    }

    
}