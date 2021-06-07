using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {   
            // Represents the unique name property that was set inside the TokenService.cs
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }
        public static int GetUserId(this ClaimsPrincipal user)
        {   
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    }
}