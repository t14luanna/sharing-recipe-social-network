using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using SRSN.DatabaseManager.ViewModels;

namespace SRSN.DatabaseManager.Services
{
    public class EmailSender : IEmailSender
    {
        public EmailSender()
        {
        }

        public AuthMessageSenderOptions Options { get; } //set only via Secret Manager

        public Task Execute(string apiKey, string subject, string message, string email)
        {
            // API Key get from IOptions
            // Command line to generate secret key: dotnet user-secrets set SendGridUser SendGridApiKeyName
            // %APPDATA%/Microsoft/UserSecrets/<WebAppName-userSecretsId> where to find secret json, config SendGridKey here
            // Json file here 
            // {
            //   "SendGridUser": "KeyName",
            //   "SendGridKey": "KeyValues"
            //}
            // link to register sendgrid account: https://sendgrid.com
            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("ngocdbse62232@fpt.edu.vn", "DAO BAO NGOC"),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));

            // Disable click tracking.
            // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
            msg.SetClickTracking(false, false);

            return client.SendEmailAsync(msg);
        }
        public Task SendEmailAsync(string email, string subject, string message)
        {
            var key = "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";
            return Execute(key, subject, message, email);
        }
    }
}
