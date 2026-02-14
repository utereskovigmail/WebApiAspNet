using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Location.City;
using Domain;
using Domain.Entities.Location;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class CityService(AppDbTransferContext appDbContext, 
    IImageService imageService,
    IMapper mapper) : ICityService
{
    public async Task<CityItemModel> CreateAsync(CityCreateModel model)
    {
        var entity = mapper.Map<CityEntity>(model);
        if (model.Image != null)
        {
            entity.Image = await imageService.UploadImageAsync(model.Image);
        }
        // Console.WriteLine("Details: " + entity.Name + " " + entity.Description +" "+ entity.Id + " " + entity.CountryId + " " + entity.Country.Name);
       
        await appDbContext.Cities.AddAsync(entity);
        await appDbContext.SaveChangesAsync();
        var item = mapper.Map<CityItemModel>(entity);
        return item;
    }

    public async Task<List<CityItemModel>> GetListAsync()
    {
        var list  = await appDbContext.Cities
            .Where(c => c.IsDeleted == false)
            .ProjectTo<CityItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();
        return list;
    }
}