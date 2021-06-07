using System.Text.Json;
using API.Helpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);

            // Set the Pagination to camelcase
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            // Add pagination to response headers
            // JsonSerializer beacuse Add() takes in a Key and string value
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader, options));

            // Because we are adding a customer header, 
            // we need to add a cause header to make this header available
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}