using System.Collections.Immutable;
using System.Text;
using System.Text.Json;
using Core.Interfaces;
using Core.Models.Identity;
using Core.Services;
using Domain;
using Domain.Entities;
using Domain.Entities.Location;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using WebApiTransfer.Filters;
using WebApiTransfer.ProgramTasks;

var builder = WebApplication.CreateBuilder(args);




string st = builder.Configuration.GetConnectionString("DefaultConnection");
// Add services to the container.
builder.Services.AddDbContext<AppDbTransferContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var assemblyName = typeof(LoginModel).Assembly.GetName().Name;

// Swagger WITHOUT JWT security
builder.Services.AddSwaggerGen(opt =>
{
    var fileDoc = $"{assemblyName}.xml";
    var filePath = Path.Combine(AppContext.BaseDirectory, fileDoc);
    opt.IncludeXmlComments(filePath);
    
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token in the format: Bearer {your token}"
    });

    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddScoped<ICountryService, CountryService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<ICityService, CityService>();
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddHostedService<StartupTask>();
builder.Services.AddScoped<ISmtpServiceDeployAdmins, SmtpServiceDeployAdminsDeployAdmins>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISmtpService, SmtpService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<ITransportationService, TransportationService>();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

// Identity without JWT
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
    .AddSignInManager<SignInManager<UserEntity>>()
    .AddDefaultTokenProviders();

// Removed: JwtTokenService
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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

    // VERY IMPORTANT: read JWT from Authorization header
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                context.Token = authHeader.Substring("Bearer ".Length);
            }

            return Task.CompletedTask;
        }
    };
});

// Removed: AddJwtBearer()
// Removed: JWT cookie extraction

builder.Services.AddMvc(options =>
{
    options.Filters.Add<ValidationFilter>();
});

// BEFORE builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowTwoDomains", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://transportationfrontend.somee.com",
                "http://192.168.64.4:4321"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});



var app = builder.Build();

app.UseCors("AllowTwoDomains");

// Configure the HTTP request pipeline.

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbTransferContext>();
    var imageService = scope.ServiceProvider.GetRequiredService<IImageService>();
    db.Database.Migrate();

    if (!db.Countries.Any())
    {
        var jsonPath = Path.Combine(app.Environment.ContentRootPath, "Seeding", "Countries","CountrySeeding.json");
        // var jsonPath = Path.Combine(app.Environment.ContentRootPath, "Seeding/Countries/CountrySeeding.json");
        var json = File.ReadAllText(jsonPath);

        var items = JsonSerializer.Deserialize<List<CountryEntity>>(json);

        foreach (var item in items)
        {
            var fileName = await imageService.UploadLocalImageAsync(Path.Combine("Seeding","Countries","Images", item.Image));
            // var fileName = await imageService.UploadLocalImageAsync($"Seeding/Countries/Images/{item.Image}");
            item.Image = fileName;
        }

        db.Countries.AddRange(items);
        db.SaveChanges();
    }

    if (!db.Cities.Any())
    {
        var jsonPath = Path.Combine(app.Environment.ContentRootPath, "Seeding", "Cities", "CitySeeding.json");
        // var jsonPath = Path.Combine(app.Environment.ContentRootPath, "Seeding/Cities/CitySeeding.json");
        var json = File.ReadAllText(jsonPath);

        var items = JsonSerializer.Deserialize<List<CityEntity>>(json);

        foreach (var item in items)
        {
            var fileName = await imageService.UploadLocalImageAsync(Path.Combine("Seeding","Cities","Images", item.Image));
            item.Image = fileName;
        }

        db.Cities.AddRange(items);
        db.SaveChanges();
    }

    var myAppDbContext = scope.ServiceProvider.GetRequiredService<AppDbTransferContext>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
    myAppDbContext.Database.Migrate();

    var roles = new[] { "User", "Admin" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new RoleEntity { Name = role });
        }
    }

    if (!myAppDbContext.Users.Any())
    {
        var userManager = scope.ServiceProvider
            .GetRequiredService<UserManager<UserEntity>>();
        var adminUser = new UserEntity
        {
            UserName = "Tereshkovych",
            Email = "tereshkovych_yurii@gymnasia21.lutsk.ua",
            FirstName = "System",
            LastName = "Administrator",
            Image = "default.jpg"
        };
        var result = await userManager.CreateAsync(adminUser, "Admin123");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }

    if (!db.TransportationStatuses.Any())
    {
        var jsonPath = Path.Combine(app.Environment.ContentRootPath, "Seeding", "TransportationStatus", "TransportationStatuses.json");
        // var jsonPath = Path.Combine(app.Environment.ContentRootPath, "Seeding/TransportationStatus/TransportationStatuses.json");
        var json = File.ReadAllText(jsonPath);
        var items = JsonSerializer.Deserialize<List<TransportationStatusEntity>>(json);
        db.TransportationStatuses.AddRange(items);
        db.SaveChanges();
    }

    if (!db.Transportations.Any())
    {
        var jsonPath = Path.Combine(app.Environment.ContentRootPath, "Seeding", "Transporation", "Transportations.json");
        // var jsonPath = Path.Combine(app.Environment.ContentRootPath, "Seeding/Transporation/Transportations.json");
        var json = File.ReadAllText(jsonPath);
        var items = JsonSerializer.Deserialize<List<TransportationEntity>>(json);
        db.Transportations.AddRange(items);
        db.SaveChanges();
    }
}

app.UseSwagger();
app.UseSwaggerUI();

var dirImageName = builder.Configuration.GetValue<string>("DirImageName") ?? "images";
var path = Path.Combine(Directory.GetCurrentDirectory(), dirImageName);

Directory.CreateDirectory(path); 

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(path),
    RequestPath = "/" + dirImageName
});




app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

Console.WriteLine($"ENV: {builder.Environment.EnvironmentName}");

app.Run();
