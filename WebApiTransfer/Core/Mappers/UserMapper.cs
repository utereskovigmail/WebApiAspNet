using AutoMapper;
using Core.Models.Identity;
using Core.Models.Location;

namespace Core.Mappers;

public class UserMapper:Profile
{
    public UserMapper()
    {
        // CreateMap<RegisterModel, UserEntity>()
        //     .ForMember(opt => opt.Image, x => x.Ignore() )
        //     .ForMember(x => x.PasswordHash, x => x.Ignore());
        //
    }
}