using Core.Interfaces;
using Core.Services;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace WebApiTransfer.ProgramTasks;

public class StartupTask : IHostedService
{
    private readonly IServiceProvider _services;

    public StartupTask(IServiceProvider services)
    {
        _services = services;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("App has started. Running startup logic...");

        using var scope = _services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
        var smtpService = scope.ServiceProvider.GetRequiredService<ISmtpServiceDeployAdmins>();
        
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new RoleEntity { Name = "Admin" });
        
        var admins = await userManager.GetUsersInRoleAsync("Admin");
        
        smtpService.SendEmail(admins.ToList());
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        
        return Task.CompletedTask;
    }
}
