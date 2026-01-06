using AutoMapper;
using Core.Models.Identity;
using Core.Models.Location;

namespace Core.Mappers;

public class UserMapper:Profile
{
    public UserMapper()
    {
        CreateMap<GoogleAccountModel, UserEntity>()
            .ForMember(x => x.Image, opt => opt.Ignore())
            .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.Email));
        // CreateMap<RegisterModel, UserEntity>()
        //     .ForMember(opt => opt.Image, x => x.Ignore() )
        //     .ForMember(x => x.PasswordHash, x => x.Ignore());
        //
    }
}