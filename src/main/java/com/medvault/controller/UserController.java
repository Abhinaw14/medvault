package com.medvault.controller;

import com.medvault.dto.AdminRegistrationDTO;
import com.medvault.dto.PasswordResetDTO;
import com.medvault.dto.FirstTimePasswordResetDTO;
import com.medvault.entity.User;
import com.medvault.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allow CORS for frontend
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> getAll() {
        return service.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) { 
        return service.getUserById(id); 
    }

    @PostMapping
    public User create(@RequestBody User user) { 
        return service.createUser(user); 
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { 
        service.deleteUser(id); 
    }

    // Admin registration endpoint
    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody AdminRegistrationDTO dto) {
        try {
            User adminUser = service.registerAdmin(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin registered successfully");
            response.put("user", adminUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Admin password reset endpoint
    @PostMapping("/admin/reset-password")
    public ResponseEntity<?> resetAdminPassword(@Valid @RequestBody PasswordResetDTO dto) {
        try {
            boolean success = service.resetAdminPassword(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password reset successfully");
            response.put("success", success);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/first-time-reset-password")
    public ResponseEntity<?> resetFirstTimePassword(@Valid @RequestBody FirstTimePasswordResetDTO dto) {
        try {
            // Validate password confirmation
            if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "New password and confirm password do not match"));
            }
            
            // For first-time reset, we need to get the username from the request
            // This would typically come from the authenticated user's session
            // For now, we'll require it as a parameter or get it from the request
            String username = dto.getUsername(); // We need to add this to the DTO
            
            boolean success = service.resetFirstTimePassword(username, dto.getCurrentPassword(), dto.getNewPassword());
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid current password"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
