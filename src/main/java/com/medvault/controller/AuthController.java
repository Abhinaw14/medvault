package com.medvault.controller;

import com.medvault.dto.UserLoginDTO;
import com.medvault.dto.PasswordResetRequestDTO;
import com.medvault.dto.PasswordResetWithTokenDTO;
import com.medvault.entity.User;
import com.medvault.service.UserService;
import com.medvault.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.mail.disablePasswordResetEmails:true}")
    private boolean disablePasswordResetEmails;

    // Store reset tokens in memory (in production, use Redis or database)
    private final Map<String, String> resetTokens = new HashMap<>();

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO loginDTO) {
        try {
            Optional<User> userOpt = userService.findByUsername(loginDTO.getUsername());
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid username or password"));
            }

            User user = userOpt.get();
            
            // Check if user is approved
            if (user.getStatus() != User.Status.APPROVED) {
                return ResponseEntity.badRequest().body(Map.of("message", "Account not approved"));
            }

            // Verify password
            if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid username or password"));
            }

            // Check if this is first login
            if (user.getIsFirstLogin()) {
                return ResponseEntity.ok(Map.of(
                    "message", "First login detected",
                    "requiresPasswordChange", true,
                    "token", "", // token will be provided after first-time change
                    "username", user.getUsername(),
                    "role", user.getRole()
                ));
            }

            // Regular login
            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "token", "mock-token", // replace with real JWT when enabled
                "username", user.getUsername(),
                "role", user.getRole()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@Valid @RequestBody PasswordResetRequestDTO request) {
        try {
            Optional<User> userOpt = userService.findByEmail(request.getEmail());
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
            }

            User user = userOpt.get();
            
            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            resetTokens.put(resetToken, user.getEmail());
            
            // Optionally send reset email (disabled by default via properties)
            if (!disablePasswordResetEmails) {
                emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetToken);
            }
            
            return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to send reset email: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetWithTokenDTO resetDTO) {
        try {
            // Validate passwords match
            if (!resetDTO.getNewPassword().equals(resetDTO.getConfirmPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Passwords do not match"));
            }

            // Find user by reset token
            String email = resetTokens.get(resetDTO.getResetToken());
            if (email == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired reset token"));
            }

            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
            }

            User user = userOpt.get();
            
            // Update password
            user.setPassword(passwordEncoder.encode(resetDTO.getNewPassword()));
            user.setIsFirstLogin(false);
            userService.save(user);
            
            // Remove used token
            resetTokens.remove(resetDTO.getResetToken());
            
            // Optionally send confirmation email (disabled by default via properties)
            if (!disablePasswordResetEmails) {
                emailService.sendPasswordResetConfirmation(user.getEmail(), user.getFirstName());
            }
            
            return ResponseEntity.ok(Map.of("message", "Password reset successful"));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password reset failed: " + e.getMessage()));
        }
    }

    @PostMapping("/change-first-time-password")
    public ResponseEntity<?> changeFirstTimePassword(@RequestParam Long userId, 
                                                   @RequestParam String currentPassword,
                                                   @RequestParam String newPassword) {
        try {
            boolean success = userService.resetFirstTimePassword(userId, currentPassword, newPassword);
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid current password"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password change failed: " + e.getMessage()));
        }
    }
}
