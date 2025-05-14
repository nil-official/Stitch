package com.ecommerce.service.impl;

import com.ecommerce.dto.EmailProductDto;
import com.ecommerce.exception.EmailSendingException;
import com.ecommerce.model.User;
import com.ecommerce.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final String frontendBaseUrl;

    public EmailServiceImpl(JavaMailSender mailSender,
                            TemplateEngine templateEngine,
                            @Qualifier("frontendBaseUrl") String frontendBaseUrl) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    public void sendEmail(String to, String subject, String templatePath, Map<String, Object> templateModel) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            // Set email properties
            helper.setTo(to);
            helper.setSubject(subject);

            // Process template
            Context context = new Context();
            context.setVariables(templateModel);
            String htmlContent = templateEngine.process(templatePath, context);

            helper.setText(htmlContent, true);

            // Send email
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailSendingException("Email Service Implementation: Failed to send email", e);
        }

    }

    @Override
    public void sendOtpEmail(User user, String otp, String purpose) {

        String subject;
        String message;
        String additionalInfo = null;
        String templatePath = "email/otp";

        switch (purpose.toLowerCase()) {
            case "registration":
                subject = "Complete Your Registration";
                message = "Thank you for registering with our ecommerce platform. Please use the following One-Time Password (OTP) to verify your account:";
                break;
            case "password-reset":
                subject = "Reset Your Password";
                message = "We received a request to reset your password. Please use the following One-Time Password (OTP) to verify your identity:";
                additionalInfo = "If you did not request a password reset, please consider changing your password for security reasons.";
                break;
            case "email-update":
                subject = "Verify Email Update";
                message = "We received a request to update your email address. Please use the following One-Time Password (OTP) to verify this change:";
                additionalInfo = "If you did not request this change, please contact our support team immediately as your account may be at risk.";
                break;
            default:
                subject = "OTP Verification";
                message = "You have requested a verification code. Please use the following One-Time Password (OTP):";
        }

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", user.getFirstName() + " " + user.getLastName());
        templateModel.put("subject", subject);
        templateModel.put("message", message);
        templateModel.put("otp", otp);
        templateModel.put("expiryMinutes", 10);
        templateModel.put("additionalInfo", additionalInfo);

        sendEmail(user.getEmail(), subject, templatePath, templateModel);

    }

    @Override
    public void sendPromotionalEmail(User user, List<EmailProductDto> products, String purpose) {

        String subject;
        String heading;
        String mainMessage;
        String actionText;
        String actionUrl;
        String additionalInfo = null;
        String templatePath = "email/products";

        switch (purpose.toLowerCase()) {
            case "recommendation":
                subject = "Products Recommended Just For You";
                heading = "Top Picks Just for You - Discover Your Next Favorite";
                mainMessage = "We’ve curated a selection of products we think you’ll love based on your recent activity. Dive in and discover something special.";
                actionText = "Explore More";
                actionUrl = "/products/recommendation";
                additionalInfo = "These recommendations are based on your browsing history and previous purchases.";
                break;
            case "sale":
                subject = "Special Sale: Up to 50% OFF!";
                heading = "Limited Time Sale!";
                mainMessage = "Don't miss out on these amazing discounts. Limited time only!";
                actionText = "Shop Now";
                actionUrl = "/products/sale";
                additionalInfo = "Sale ends soon. While stocks last.";
                break;
            case "new-arrivals":
                subject = "New Arrivals Just Dropped!";
                heading = "Check Out What's New";
                mainMessage = "We've just added these exciting new products to our collection.";
                actionText = "Explore New Arrivals";
                actionUrl = "/products/new";
                break;
            default:
                subject = "Products Picked For You";
                heading = "Products You Might Like";
                mainMessage = "We thought you might be interested in these products:";
                actionText = "Browse More";
                actionUrl = "/products";
        }

        String greeting = "Hello " + user.getFirstName() + ",";

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("heading", heading);
        templateModel.put("greeting", greeting);
        templateModel.put("mainMessage", mainMessage);
        templateModel.put("products", products);
        templateModel.put("frontendBaseUrl", frontendBaseUrl);
        templateModel.put("currency", "INR");
        templateModel.put("actionUrl", actionUrl);
        templateModel.put("actionText", actionText);
        templateModel.put("additionalInfo", additionalInfo);

        sendEmail(user.getEmail(), subject, templatePath, templateModel);

    }

    private void sendEmailOld(String to, String subject, String content) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        try {
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // Set content as HTML
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailSendingException("Failed to send email to " + to, e);
        }
    }

    @Async
    @Override
    public void sendVerificationEmail(String toEmail, String verifyLink) throws MessagingException {
        // Create email content
        String subject = "Email Verification";
//        String content = "<p>Please verify your email by clicking the link below:</p>"
//                + "<a href=\"" + verifyLink + "\">Verify Email</a>";

        // New content
        String content =
                "<!DOCTYPE html>\n" +
                        "<html lang=\"en\">\n" +
                        "<head>\n" +
                        "    <meta charset=\"UTF-8\">\n" +
                        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                        "    <title>Email Verification</title>\n" +
                        "    <style>\n" +
                        "        body {\n" +
                        "            font-family: Arial, sans-serif;\n" +
                        "            background-color: #f9f9f9;\n" +
                        "            margin: 0;\n" +
                        "            padding: 0;\n" +
                        "        }\n" +
                        "        .email-container {\n" +
                        "            max-width: 600px;\n" +
                        "            margin: 40px auto;\n" +
                        "            background-color: #ffffff;\n" +
                        "            padding: 30px;\n" +
                        "            border-radius: 10px;\n" +
                        "            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n" +
                        "            text-align: center;\n" +
                        "        }\n" +
                        "        .logo {\n" +
                        "            font-size: 28px;\n" +
                        "            font-weight: bold;\n" +
                        "            color: #000000;\n" +
                        "            margin-bottom: 20px;\n" +
                        "        }\n" +
                        "        .content {\n" +
                        "            font-size: 16px;\n" +
                        "            color: #333333;\n" +
                        "            line-height: 1.8;\n" +
                        "            margin-bottom: 20px;\n" +
                        "        }\n" +
                        "        .verify-button {\n" +
                        "            display: inline-block;\n" +
                        "            padding: 12px 25px;\n" +
                        "            font-size: 16px;\n" +
                        "            font-weight: bold;\n" +
                        "            color: #ffffff !important;\n" +
                        "            background-color: #000000;\n" +
                        "            text-decoration: none;\n" +
                        "            border-radius: 5px;\n" +
                        "        }\n" +
                        "        .verify-button:hover {\n" +
                        "            background-color: #333333;\n" +
                        "        }\n" +
                        "        .footer {\n" +
                        "            font-size: 12px;\n" +
                        "            color: #888888;\n" +
                        "            margin-top: 20px;\n" +
                        "        }\n" +
                        "    </style>\n" +
                        "</head>\n" +
                        "<body>\n" +
                        "    <div class=\"email-container\">\n" +
                        "        <div class=\"logo\">Stitch</div>\n" +
                        "        <div class=\"content\">\n" +
                        "            <p>Please verify your email by clicking the button below:</p>\n" +
                        "            <a href=\"" + verifyLink + "\" class=\"verify-button\">Verify Email</a>\n" +
                        "        </div>\n" +
                        "        <div class=\"footer\">\n" +
                        "            If you did not request this email, you can safely ignore it.\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</body>\n" +
                        "</html>\n";

        // Send the email
        sendEmailOld(toEmail, subject, content);
    }

    @Async
    @Override
    public void sendResetPasswordEmail(String toEmail, String resetLink) throws MessagingException {
        // Create email content
        String subject = "Reset Your Password";
//        String content = "<p>You have requested to reset your password. Click the link below to reset it:</p>"
//                + "<a href=\"" + resetLink + "\">Reset Password</a>"
//                + "<p><b>Note:</b> This link is valid for 1 hour only.</p>";

        // New content
        String content =
                "<!DOCTYPE html>\n" +
                        "<html lang=\"en\">\n" +
                        "<head>\n" +
                        "    <meta charset=\"UTF-8\">\n" +
                        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                        "    <title>Email Verification</title>\n" +
                        "    <style>\n" +
                        "        body {\n" +
                        "            font-family: Arial, sans-serif;\n" +
                        "            background-color: #f9f9f9;\n" +
                        "            margin: 0;\n" +
                        "            padding: 0;\n" +
                        "        }\n" +
                        "        .email-container {\n" +
                        "            max-width: 600px;\n" +
                        "            margin: 40px auto;\n" +
                        "            background-color: #ffffff;\n" +
                        "            padding: 30px;\n" +
                        "            border-radius: 10px;\n" +
                        "            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n" +
                        "            text-align: center;\n" +
                        "        }\n" +
                        "        .logo {\n" +
                        "            font-size: 28px;\n" +
                        "            font-weight: bold;\n" +
                        "            color: #000000;\n" +
                        "            margin-bottom: 20px;\n" +
                        "        }\n" +
                        "        .content {\n" +
                        "            font-size: 16px;\n" +
                        "            color: #333333;\n" +
                        "            line-height: 1.8;\n" +
                        "            margin-bottom: 20px;\n" +
                        "        }\n" +
                        "        .verify-button {\n" +
                        "            display: inline-block;\n" +
                        "            padding: 12px 25px;\n" +
                        "            font-size: 16px;\n" +
                        "            font-weight: bold;\n" +
                        "            color: #ffffff !important;\n" +
                        "            background-color: #000000;\n" +
                        "            text-decoration: none;\n" +
                        "            border-radius: 5px;\n" +
                        "        }\n" +
                        "        .verify-button:hover {\n" +
                        "            background-color: #333333;\n" +
                        "        }\n" +
                        "        .footer {\n" +
                        "            font-size: 12px;\n" +
                        "            color: #888888;\n" +
                        "            margin-top: 20px;\n" +
                        "        }\n" +
                        "    </style>\n" +
                        "</head>\n" +
                        "<body>\n" +
                        "    <div class=\"email-container\">\n" +
                        "        <div class=\"logo\">Stitch</div>\n" +
                        "        <div class=\"content\">\n" +
                        "            <p>You have requested to reset your password. Click the link below to reset it:</p>\n" +
                        "            <a href=\"" + resetLink + "\" class=\"verify-button\">Reset Password</a>\n" +
                        "            <p><b>Note:</b>This link is valid for 1 hour only.</p>\n" +
                        "        </div>\n" +
                        "        <div class=\"footer\">\n" +
                        "            If you did not request this email, you can safely ignore it.\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</body>\n" +
                        "</html>\n";


        // Send the email
        sendEmailOld(toEmail, subject, content);
    }

}
