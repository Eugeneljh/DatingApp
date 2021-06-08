using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    // Helps to map one object to another
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
            // Give a destination property (PhotoUrl)
            // Tell it where to map from, and the source that we are mapping from
            // Goes into the Photos collection, and get the first or default photo that is main
            // and get the url for that
                .ForMember(dest => dest.PhotoUrl, 
                    opt => opt.MapFrom(
                        src => src.Photos.FirstOrDefault(
                            x => x.IsMain).Url))
                .ForMember(dest => dest.Age, 
                    opt => opt.MapFrom(
                        src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderPhotoUrl, 
                    opt => opt.MapFrom(
                        src => src.Sender.Photos.FirstOrDefault(
                            x => x.IsMain).Url))
                .ForMember(dest => dest.RecipientPhotoUrl, 
                    opt => opt.MapFrom(
                        src => src.Recipient.Photos.FirstOrDefault(
                            x => x.IsMain).Url));
        }
    }
}