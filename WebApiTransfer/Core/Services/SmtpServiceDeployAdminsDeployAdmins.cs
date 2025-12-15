using System.Net;
using System.Net.Mail;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Core.Services;

public class SmtpServiceDeployAdminsDeployAdmins : ISmtpServiceDeployAdmins
{
    private readonly IConfiguration _config;
    
    public SmtpServiceDeployAdminsDeployAdmins(IConfiguration config)
    {
        _config = config;
    }
    public bool SendEmail(List<UserEntity> admins)
    {
        foreach (var admin in admins)
        {
            var email = admin.Email;
            var name = admin.FirstName + " " + admin.LastName;
            var fromAddress = new MailAddress("mywork123213@gmail.com", "Transportation website");
            var toAddress = new MailAddress(email, "Dear " + name);
            var fromPassword = _config["SmtpToken"];
            const string subject = "Verification code";
            string body = $"Hello dear, {name}, we are happy to announce that the website was successfully started!";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            using var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            };

            try
            {
                smtp.Send(message);
                Console.WriteLine("Email sent successfully to " + name);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email to: " + name + " " + ex.Message);
                return false;
            }
        }

        return true;
    }
}