using AutoMapper;
using CoreReactRedux.Dtos;
using CoreReactRedux.Models;

namespace CoreReactRedux.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}