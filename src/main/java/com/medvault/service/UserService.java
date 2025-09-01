// UserService.java
package com.medvault.service;

import com.medvault.dto.AdminRegistrationDTO;
import com.medvault.dto.PasswordResetDTO;
import com.medvault.entity.User;
import com.medvault.entity.Role;
import com.medvault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() { 
        return repo.findAll(); 
    }
    
    public User getUserById(Long id) { 
        return repo.findById(id).orElse(null); 
    }
    
    public User createUser(User user) { 
        return repo.save(user); 
    }
    
    public void deleteUser(Long id) { 
        repo.deleteById(id); 
    }

    // Admin registration method
    public User registerAdmin(AdminRegistrationDTO dto) {
        // Check if email already exists (since we use email as username)
        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Create new admin user
        User adminUser = new User(
            dto.getEmail(), // Use email as username
            passwordEncoder.encode(dto.getPassword()),
            dto.getEmail(),
            dto.getFirstName(),
            dto.getLastName(),
            dto.getPhoneNumber() != null ? dto.getPhoneNumber() : "", // Add phone number
            Role.ADMIN
        );
        adminUser.setStatus(User.Status.APPROVED); // Ensure admin is approved

        return repo.save(adminUser);
    }

    // Password reset method
    public boolean resetAdminPassword(PasswordResetDTO dto) {
        Optional<User> userOpt = repo.findByEmail(dto.getEmail());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Admin not found");
        }

        User user = userOpt.get();
        
        // Check if user is an admin
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("User is not an admin");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setIsFirstLogin(false);
        repo.save(user);
        
        return true;
    }

    public boolean resetFirstTimePassword(String username, String currentPassword, String newPassword) {
        Optional<User> userOpt = findByUsername(username);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        
        // Check if this is actually a first-time login
        if (!user.getIsFirstLogin()) {
            throw new RuntimeException("This is not a first-time login");
        }
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }
        
        // Update password and mark as not first login
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setIsFirstLogin(false);
        user.setUpdatedAt(LocalDateTime.now());
        
        repo.save(user);
        return true;
    }

    public boolean resetFirstTimePassword(Long userId, String currentPassword, String newPassword) {
        Optional<User> userOpt = repo.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        
        // Check if this is actually a first-time login
        if (!user.getIsFirstLogin()) {
            throw new RuntimeException("This is not a first-time login");
        }
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }
        
        // Update password and mark as not first login
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setIsFirstLogin(false);
        user.setUpdatedAt(LocalDateTime.now());
        
        repo.save(user);
        return true;
    }

    // Find user by username (returns Optional<User>)
    public Optional<User> findByUsername(String username) {
        return repo.findByUsername(username);
    }
    
    // Save user
    public User save(User user) {
        // Password encoding is now handled in the controller/service layer
        // This method just saves the user as-is
        return repo.save(user);
    }

    // Find user by email
    public Optional<User> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    // Find users by status
    public List<User> findByStatus(User.Status status) {
        return repo.findByStatus(status);
    }
}
