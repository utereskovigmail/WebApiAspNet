using AutoMapper;
using Core.Models.Location.City;
using Domain.Entities.Location;

namespace Core.Mappers;

public class CityMapper : Profile
{
    public CityMapper()
    {
        CreateMap<CityEntity, CityItemModel>()
            .ForMember(d => d.Country, o => o.MapFrom(s => s.Country.Name));
        
        
     

        CreateMap<CityCreateModel, CityEntity>()
            .ForMember(x=>x.Image, opt=>opt.Ignore());
    }
}