using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        // RequestDelegate ->   Tells you what is coming up next in the middleware pipeline
        // ILogger ->           Logs the exception in the terminal
        // IHostEnvironment ->  Tells us which environment we are in (Developer, Production, etc.)
        public RequestDelegate _next { get; }
        public ILogger<ExceptionMiddleware> _logger { get; }
        public IHostEnvironment _env { get; }
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
        }

        // Happens in the context of the HTTP request. Access is available when you are in the middleware
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Pass the context to the next piece of middleware, it will live at the top of the middleware
                // Anything below this will invoke next and throw the exception up till it reaches something 
                // that can handle the exception
                await _next(context);
            }
            catch (Exception e)
            {
                // Write out the exception to our Response
                _logger.LogError(e, e.Message);
                context.Response.ContentType = "applicaiton/JSON";
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                // Use '?' ternary operator
                // If we are in Dev environment, do first line
                // Else, do second line 
                var response = _env.IsDevelopment()
                    ? new ApiException(context.Response.StatusCode, e.Message, e.StackTrace?.ToString())
                    : new ApiException(context.Response.StatusCode, "Internal Server Error");

                // Serialize the response in a JSON response
                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}