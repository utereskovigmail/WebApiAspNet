using System.Text;
using System.Text.Json;
using Core.Interfaces;
using Core.Services;
using Domain;
using Domain.Entities.Location;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using WebApiTransfer.Filters;

var builder = WebApplication.CreateBuilder(args);

IImageService imageService = new ImageService(builder.Configuration);

// Add services to the container.
builder.Services.AddDbContext<AppDbTransferContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddControllers();

builder.Services.AddCors();

builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddScoped<ICountryService, CountryService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<ICityService, CityService>();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddIdentityCore<UserEntity>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddRoles<RoleEntity>()
    .AddRoleManager<RoleManager<RoleEntity>>()
    .AddEntityFrameworkStores<AppDbTransferContext>()
    .AddSignInManager<SignInManager<UserEntity>>();

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });


builder.Services.AddMvc(options =>
{
    options.Filters.Add<ValidationFilter>();
});

var app = builder.Build();

// Configure the HTTP request pipeline.


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbTransferContext>();
    db.Database.Migrate();
    
    // db.Countries.RemoveRange(db.Countries);
    // db.SaveChanges();

    if (!db.Countries.Any())
    {
        var jsonPath = Path.Combine(app.Environment.ContentRootPath, "Seeding/Countries/CountrySeeding.json");
        var json = File.ReadAllText(jsonPath);
        
        
        
        var items = JsonSerializer.Deserialize<List<CountryEntity>>(json);

        foreach (var item in items)
        {
            var fileName = await imageService.UploadLocalImageAsync($"Seeding/Countries/Images/{item.Image}");
            item.Image = fileName;
        }
        
        db.Countries.AddRange(items);
        db.SaveChanges();
    }
}

app.UseCors(policy =>
    policy.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

app.MapControllers();


var dirImageName = builder.Configuration.GetValue<string>("DirImageName") ?? "images";

// Console.WriteLine("Image dir {0}", dirImageName);
var path = Path.Combine(Directory.GetCurrentDirectory(), dirImageName);
Directory.CreateDirectory(dirImageName);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(path),
    RequestPath = $"/{dirImageName}"
});

app.Run();
