using Microsoft.AspNetCore.Http;

namespace Core.Interfaces;

public interface IImageService
{
    public Task<string> UploadImageAsync(IFormFile file);
    Task<string> UploadLocalImageAsync(string relativePath);
    Task<string> SaveImageAsync(byte[] bytes);
    Task<string> SaveImageFromUrlAsync(string imageUrl);

}