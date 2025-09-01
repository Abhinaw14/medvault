package com.medvault.repository;

import com.medvault.entity.Role;
import com.medvault.entity.UserRegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRegistrationRequestRepository extends JpaRepository<UserRegistrationRequest, Long> {
    
    // Find requests by status
    List<UserRegistrationRequest> findByStatus(UserRegistrationRequest.Status status);
    
    // Find requests by role
    List<UserRegistrationRequest> findByRole(Role role);
    
    // Find pending requests
    List<UserRegistrationRequest> findByStatusOrderByCreatedAtDesc(UserRegistrationRequest.Status status);
    
    // Find requests by email
    Optional<UserRegistrationRequest> findByEmail(String email);
    
    // Find requests by phone number
    Optional<UserRegistrationRequest> findByPhoneNumber(String phoneNumber);
    
    // Find requests processed by specific admin
    List<UserRegistrationRequest> findByProcessedByOrderByProcessedAtDesc(Long adminId);
    
    // Count requests by status
    long countByStatus(UserRegistrationRequest.Status status);
    
    // Find requests created in date range
    List<UserRegistrationRequest> findByCreatedAtBetweenOrderByCreatedAtDesc(
        java.time.LocalDateTime startDate, 
        java.time.LocalDateTime endDate
    );
}
