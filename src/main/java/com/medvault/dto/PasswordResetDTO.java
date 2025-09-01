package com.medvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public class PasswordResetDTO {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "New password is required")
    private String newPassword;

    // Default constructor
    public PasswordResetDTO() {}

    // Constructor with all fields
    public PasswordResetDTO(String email, String newPassword) {
        this.email = email;
        this.newPassword = newPassword;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
