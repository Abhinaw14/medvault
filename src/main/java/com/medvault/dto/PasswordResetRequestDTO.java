package com.medvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public class PasswordResetRequestDTO {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    // Default constructor
    public PasswordResetRequestDTO() {}

    // Constructor with email
    public PasswordResetRequestDTO(String email) {
        this.email = email;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
