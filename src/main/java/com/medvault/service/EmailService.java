package com.medvault.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String defaultFrom;

    private void setFromIfAvailable(SimpleMailMessage message) {
        if (defaultFrom != null && !defaultFrom.isBlank()) {
            // Add @gmail.com to the username for the 'from' field
            String fromEmail = defaultFrom.contains("@") ? defaultFrom : defaultFrom + "@gmail.com";
            message.setFrom(fromEmail);
            logger.debug("Setting from email to: {}", fromEmail);
        }
    }

    public void sendApprovalEmail(String to, String firstName, String email, String generatedPassword) {
        try {
            logger.info("Preparing approval email for {}", to);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            setFromIfAvailable(message);
            message.setSubject("Your MedVault Account Approved");
            message.setText(String.format(
                    "Hello %s,\n\n" +
                            "Your account has been approved.\n\n" +
                            "Username: %s\n" +
                            "Temporary Password: %s\n\n" +
                            "For your security, you must change this password at first login.",
                    firstName, email, generatedPassword
            ));

            logger.info("Sending approval email to {}", to);
            mailSender.send(message);
            logger.info("Approval email sent successfully to {}", to);

        } catch (Exception e) {
            logger.error("Failed to send approval email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Email sending failed: " + e.getMessage(), e);
        }
    }

    public void sendRejectionEmail(String to, String firstName) {
        try {
            logger.info("Preparing rejection email for {}", to);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            setFromIfAvailable(message);
            message.setSubject("Your MedVault Account Request Rejected");
            message.setText(String.format(
                    "Hello %s,\n\n" +
                            "Unfortunately, your registration request has been rejected.\n\n" +
                            "Please contact support if you believe this was a mistake.",
                    firstName
            ));

            logger.info("Sending rejection email to {}", to);
            mailSender.send(message);
            logger.info("Rejection email sent successfully to {}", to);

        } catch (Exception e) {
            logger.error("Failed to send rejection email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Email sending failed: " + e.getMessage(), e);
        }
    }

    public void sendPasswordResetEmail(String to, String firstName, String resetToken) {
        try {
            logger.info("Preparing password reset email for {}", to);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            setFromIfAvailable(message);
            message.setSubject("Password Reset Request - MedVault");
            message.setText(String.format(
                    "Hello %s,\n\n" +
                            "You have requested a password reset for your MedVault account.\n\n" +
                            "Reset Token: %s\n\n" +
                            "Please use this token to reset your password. If you didn't request this, please ignore this email.",
                    firstName, resetToken
            ));

            logger.info("Sending password reset email to {}", to);
            mailSender.send(message);
            logger.info("Password reset email sent successfully to {}", to);

        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Email sending failed: " + e.getMessage(), e);
        }
    }

    public void sendPasswordResetConfirmation(String to, String firstName) {
        try {
            logger.info("Preparing password reset confirmation email for {}", to);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            setFromIfAvailable(message);
            message.setSubject("Password Reset Successful - MedVault");
            message.setText(String.format(
                    "Hello %s,\n\n" +
                            "Your password has been successfully reset.\n\n" +
                            "You can now login with your new password.",
                    firstName
            ));

            logger.info("Sending password reset confirmation to {}", to);
            mailSender.send(message);
            logger.info("Password reset confirmation sent successfully to {}", to);

        } catch (Exception e) {
            logger.error("Failed to send password reset confirmation to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Email sending failed: " + e.getMessage(), e);
        }
    }

    // Test method to verify email configuration
    public void sendTestEmail(String to) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            setFromIfAvailable(message);
            message.setSubject("Test Email - MedVault");
            message.setText("This is a test email to verify the email configuration is working.");

            logger.info("Sending test email to {}", to);
            mailSender.send(message);
            logger.info("Test email sent successfully to {}", to);

        } catch (Exception e) {
            logger.error("Failed to send test email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Test email failed: " + e.getMessage(), e);
        }
    }
}