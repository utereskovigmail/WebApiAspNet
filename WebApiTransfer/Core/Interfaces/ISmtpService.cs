using Core.SMTP;

namespace Core.Interfaces;

public interface ISmtpService
{
    /// <summary>
    /// Send multiple emails
    /// </summary>
    bool SendEmails(List<EmailMessage> messages);

    /// <summary>
    /// Send a single email
    /// </summary>
    bool SendEmail(EmailMessage emailMessage);
}