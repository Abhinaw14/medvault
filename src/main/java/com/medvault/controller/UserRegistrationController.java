package com.medvault.controller;

import com.medvault.dto.AdminCreateUserDTO;
import com.medvault.dto.UserRegistrationRequestDTO;
import com.medvault.entity.User;
import com.medvault.entity.UserRegistrationRequest;
import com.medvault.service.UserRegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-registration")
@CrossOrigin(origins = "*")
public class UserRegistrationController {
    
    private final UserRegistrationService service;
    
    public UserRegistrationController(UserRegistrationService service) {
        this.service = service;
    }
    
    // Submit a new registration request (public endpoint)
    @PostMapping("/request")
    public ResponseEntity<?> submitRequest(@Valid @RequestBody UserRegistrationRequestDTO dto) {
        try {
            UserRegistrationRequest request = service.submitRequest(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration request submitted successfully");
            response.put("requestId", request.getId());
            response.put("status", request.getStatus());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    // Get all pending requests (admin only)
    @GetMapping("/requests/pending")
    public ResponseEntity<List<UserRegistrationRequest>> getPendingRequests() {
        List<UserRegistrationRequest> requests = service.getPendingRequests();
        return ResponseEntity.ok(requests);
    }
    
    // Get all requests (admin only)
    @GetMapping("/requests")
    public ResponseEntity<List<UserRegistrationRequest>> getAllRequests() {
        List<UserRegistrationRequest> requests = service.getAllRequests();
        return ResponseEntity.ok(requests);
    }
    
    // Get request by ID (admin only)
    @GetMapping("/requests/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable Long id) {
        return service.getRequestById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Admin approves request and creates user
    @PostMapping("/requests/{requestId}/approve")
    public ResponseEntity<?> approveRequest(
            @PathVariable Long requestId,
            @RequestParam Long adminId,
            @RequestParam String adminNotes,
            @RequestParam(required = false) String adminPassword) {
        try {
            Map<String, Object> result = service.approveRequest(requestId, adminId, adminNotes, adminPassword);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    // Admin rejects request
    @PostMapping("/requests/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id, 
                                         @RequestParam Long adminId,
                                         @RequestParam(required = false) String adminNotes) {
        try {
            UserRegistrationRequest request = service.rejectRequest(id, adminId, adminNotes != null ? adminNotes : "");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Request rejected successfully");
            response.put("request", request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    // Admin creates user directly (bypassing request system)
    @PostMapping("/admin/create-user")
    public ResponseEntity<?> createUserDirectly(@Valid @RequestBody AdminCreateUserDTO dto,
                                              @RequestParam Long adminId) {
        try {
            User user = service.createUserDirectly(dto, adminId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User created successfully");
            response.put("user", user);
            response.put("username", user.getUsername());
            response.put("password", user.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    // Get request statistics (admin only)
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getRequestStats() {
        long pendingCount = service.countRequestsByStatus(UserRegistrationRequest.Status.PENDING);
        long approvedCount = service.countRequestsByStatus(UserRegistrationRequest.Status.APPROVED);
        long rejectedCount = service.countRequestsByStatus(UserRegistrationRequest.Status.REJECTED);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("pending", pendingCount);
        stats.put("approved", approvedCount);
        stats.put("rejected", rejectedCount);
        stats.put("total", pendingCount + approvedCount + rejectedCount);
        
        return ResponseEntity.ok(stats);
    }
    
    // Get requests by status (admin only)
    @GetMapping("/requests/status/{status}")
    public ResponseEntity<List<UserRegistrationRequest>> getRequestsByStatus(@PathVariable String status) {
        try {
            UserRegistrationRequest.Status requestStatus = UserRegistrationRequest.Status.valueOf(status.toUpperCase());
            List<UserRegistrationRequest> requests = service.getRequestsByStatus(requestStatus);
            return ResponseEntity.ok(requests);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
