package com.medvault.controller;

import com.medvault.dto.AdminRegistrationDTO;
import com.medvault.dto.PasswordResetDTO;
import com.medvault.dto.UserDTO;
import com.medvault.entity.User;
import com.medvault.entity.UserRegistrationRequest;
import com.medvault.service.EmailService;
import com.medvault.service.TestDataService;
import com.medvault.service.UserService;
import com.medvault.service.UserRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRegistrationService userRegistrationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private TestDataService testDataService;

    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminRegistrationDTO request) {
        try {
            User savedAdmin = userService.registerAdmin(request);
            return ResponseEntity.ok("Admin registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error registering admin: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetAdminPassword(@RequestBody PasswordResetDTO request) {
        try {
            boolean success = userService.resetAdminPassword(request);
            if (success) {
                return ResponseEntity.ok("Admin password reset successfully");
            } else {
                return ResponseEntity.badRequest().body("Failed to reset password");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error resetting password: " + e.getMessage());
        }
    }
    @GetMapping("/approved-users")
    public ResponseEntity<List<UserDTO>> getApprovedUsers() {
        List<User> approvedUsers = userService.findByStatus(User.Status.APPROVED);
        List<UserDTO> userDTOs = approvedUsers.stream()
            .map(UserDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    @PostMapping("/approve/{userId}")
    public ResponseEntity<?> approveUser(@PathVariable Long userId) {
        try {
            UserRegistrationRequest request = userRegistrationService.findById(userId);
            System.out.println(userId);
            if (request == null) {
                return ResponseEntity.notFound().build();
            }

            if (request.getStatus() != UserRegistrationRequest.Status.PENDING) {
                return ResponseEntity.badRequest().body("User request is not pending");
            }

            // Generate random password
            String generatedPassword = generateRandomPassword();
            String username = request.getEmail(); // Use email as username

            // Send approval email with credentials first; if this fails, do not approve or create user
            emailService.sendApprovalEmail(request.getEmail(), request.getFirstName(), username, generatedPassword);

            // Create user only after successful email send
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(generatedPassword));
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setRole(request.getRole());
            user.setStatus(User.Status.APPROVED);
            user.setIsFirstLogin(true); // Mark as first login

            userService.save(user);
            // Update request status only after successful email send and user creation
            request.setStatus(UserRegistrationRequest.Status.APPROVED);
            request.setProcessedAt(java.time.LocalDateTime.now());
            userRegistrationService.save(request);

            // Return success with credentials for admin to see
            return ResponseEntity.ok(Map.of(
                "message", "User approved successfully",
                "credentials", Map.of(
                    "username", username,
                    "password", generatedPassword,
                    "email", request.getEmail()
                )
            ));
        } catch (Exception e) {
            e.printStackTrace(); // prints full stack trace in console
            return ResponseEntity.badRequest().body("Error approving user: " + e.getMessage());
        }
    }

    @PostMapping("/reject/{userId}")
    public ResponseEntity<?> rejectUser(@PathVariable Long userId) {
        try {
            UserRegistrationRequest request = userRegistrationService.findById(userId);
            if (request == null) {
                return ResponseEntity.notFound().build();
            }

            if (request.getStatus() != UserRegistrationRequest.Status.PENDING) {
                return ResponseEntity.badRequest().body("User request is not pending");
            }

            // Update request status
            request.setStatus(UserRegistrationRequest.Status.REJECTED);
            request.setProcessedAt(java.time.LocalDateTime.now());
            userRegistrationService.save(request);

            // Send rejection email
            emailService.sendRejectionEmail(request.getEmail(), request.getFirstName());

            return ResponseEntity.ok("User rejected successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error rejecting user: " + e.getMessage());
        }
    }

    private String generateRandomPassword() {
        // Generate 8-12 character alphanumeric password
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        int length = 8 + random.nextInt(5); // 8-12 characters
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    @PostMapping("/clear-test-data")
    public ResponseEntity<?> clearTestData() {
        try {
            if (testDataService == null) {
                return ResponseEntity.status(403).body("Operation not allowed in this environment");
            }
            testDataService.clearTestData();
            return ResponseEntity.ok("Test data cleared successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error clearing test data: " + e.getMessage());
        }
    }
    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail(@RequestParam String email) {
        try {
            System.out.println("Testing email configuration with recipient: " + email);
            emailService.sendTestEmail(email);
            return ResponseEntity.ok("Test email sent successfully to " + email);
        } catch (Exception e) {
            System.err.println("Email test failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Email test failed: " + e.getMessage());
        }
    }
}
