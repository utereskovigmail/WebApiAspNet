using System.Text.Json;
using Core.Interfaces;
using Core.Services;
using Domain;
using Domain.Entities.Location;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

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

var dirImageName = builder.Configuration.GetValue<string>("DirImageName") ?? "duplo";

// Console.WriteLine("Image dir {0}", dirImageName);
var path = Path.Combine(Directory.GetCurrentDirectory(), dirImageName);
Directory.CreateDirectory(dirImageName);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(path),
    RequestPath = $"/{dirImageName}"
});

app.Run();
