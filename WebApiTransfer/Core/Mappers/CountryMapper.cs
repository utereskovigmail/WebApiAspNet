using AutoMapper;
using Core.Models.Location;
using Domain.Entities.Location;

namespace Core.Mappers;

public class CountryMapper : Profile
{
    public CountryMapper()
    {
        CreateMap<CountryEntity,CountryItemModel>();
        // CreateMap<CountryCreateModel, CountryEntity>()
        //     .ForMember(x => x.Image, opt => opt.Ignore());
        //
        // CreateMap<CountryEditModel, CountryEntity>()
        //     .ForMember(x => x.Image, opt => opt.Ignore());

        CreateMap<CountryGeneralModel, CountryEntity>()
            .ForMember(x => x.Image, opt => opt.Ignore());

        CreateMap<CountryEntity, CountryGeneralModel>()
            .ForMember(x => x.Image, opt => opt.Ignore())
            .ForMember(x => x.ImageStr, opt => opt.Ignore())
            .ForMember(x => x.Id, opt => opt.Ignore());

    }
}