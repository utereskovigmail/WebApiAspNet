using System.Net;
using System.Net.Mail;
using Core.Interfaces;
using Core.SMTP;
using Microsoft.Extensions.Configuration;

namespace Core.Services;

public class SmtpService : ISmtpService
{
    private readonly IConfiguration _config;

    public SmtpService(IConfiguration config)
    {
        _config = config;
    }

    public bool SendEmails(List<EmailMessage> messages)
    {
        var fromAddress = new MailAddress("mywork123213@gmail.com", "Transportation website");
        var fromPassword = _config["SmtpToken"];

        using var smtp = new SmtpClient
        {
            Host = "smtp.gmail.com",
            Port = 587,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
        };

        bool allSuccess = true;

        foreach (var messageData in messages)
        {
            var toAddress = new MailAddress(messageData.To);
            using var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = messageData.Subject,
                Body = messageData.Body
            };

            try
            {
                smtp.Send(message);
                Console.WriteLine($"Email sent successfully to {messageData.To}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email to {messageData.To}: {ex.Message}");
                allSuccess = false;
            }
        }

        return allSuccess;
    }
    
    
    
    public bool SendEmail(EmailMessage emailMessage)
    {
        var fromAddress = new MailAddress("mywork123213@gmail.com", "Transportation website");
        var fromPassword = _config["SmtpToken"];

        using var smtp = new SmtpClient
        {
            Host = "smtp.gmail.com",
            Port = 587,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
        };

        bool allSuccess = true;
        
        var toAddress = new MailAddress(emailMessage.To);
        using var message = new MailMessage(fromAddress, toAddress)
        {
            Subject = emailMessage.Subject,
            Body = emailMessage.Body
        };

        try
        {
            smtp.Send(message);
            Console.WriteLine($"Email sent successfully to {emailMessage.To}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email to {emailMessage.To}: {ex.Message}");
            allSuccess = false;
        }
    

        return allSuccess;
    }
}