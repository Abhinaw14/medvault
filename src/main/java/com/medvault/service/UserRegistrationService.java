package com.medvault.service;

import com.medvault.dto.AdminCreateUserDTO;
import com.medvault.dto.UserRegistrationRequestDTO;
import com.medvault.entity.Doctor;
import com.medvault.entity.Patient;
import com.medvault.entity.User;
import com.medvault.entity.Role;
import com.medvault.entity.UserRegistrationRequest;
import com.medvault.repository.DoctorRepository;
import com.medvault.repository.PatientRepository;
import com.medvault.repository.UserRegistrationRequestRepository;
import com.medvault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class UserRegistrationService {
    
    private final UserRegistrationRequestRepository requestRepo;
    private final UserRepository userRepo;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserRegistrationService(UserRegistrationRequestRepository requestRepo, 
                                 UserRepository userRepo, 
                                 DoctorRepository doctorRepository,
                                 PatientRepository patientRepository,
                                 PasswordEncoder passwordEncoder) {
        this.requestRepo = requestRepo;
        this.userRepo = userRepo;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    // Submit a new registration request
    public UserRegistrationRequest submitRequest(UserRegistrationRequestDTO dto) {
        // Check if email already exists in requests or users
        if (requestRepo.findByEmail(dto.getEmail()).isPresent() || 
            userRepo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Check if phone number already exists
        if (requestRepo.findByPhoneNumber(dto.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("Phone number already exists");
        }
        
        // Create new request
        UserRegistrationRequest request = new UserRegistrationRequest(
            dto.getFirstName(),
            dto.getLastName(),
            dto.getEmail(),
            dto.getPhoneNumber(),
            Role.valueOf(dto.getRole())
        );
        request.setStatus(UserRegistrationRequest.Status.PENDING);
        
        // Set additional fields based on role
        if ("DOCTOR".equals(dto.getRole())) {
            request.setSpecialization(dto.getSpecialization());
            request.setLicenseNumber(dto.getLicenseNumber());
            request.setDepartment(dto.getDepartment());
        } else if ("PATIENT".equals(dto.getRole())) {
            request.setDateOfBirth(dto.getDateOfBirth());
            request.setGender(dto.getGender());
            request.setAddress(dto.getAddress());
            request.setEmergencyContact(dto.getEmergencyContact());
        }
        
        return requestRepo.save(request);
    }
    
    // Get all pending requests
    public List<UserRegistrationRequest> getPendingRequests() {
        return requestRepo.findByStatusOrderByCreatedAtDesc(UserRegistrationRequest.Status.PENDING);
    }
    
    // Get request by ID
    public Optional<UserRegistrationRequest> getRequestById(Long id) {
        return requestRepo.findById(id);
    }
    
    // Admin approves request and creates user
    public Map<String, Object> approveRequest(Long requestId, Long adminId, String adminNotes, String adminPassword) {
        UserRegistrationRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != UserRegistrationRequest.Status.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        // Generate username if not provided
        String username = generateUsername(request.getFirstName(), request.getLastName(), request.getRole());
        
        // Use admin-provided password instead of generating random one
        String password = adminPassword != null && !adminPassword.trim().isEmpty() 
            ? adminPassword.trim() 
            : generateDefaultPassword();

        // Create user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
        user.setIsFirstLogin(true); // Force password change on first login
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepo.save(user);

        // Create role-specific entity
        if (request.getRole() == Role.DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setName(savedUser.getFirstName() + " " + savedUser.getLastName());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setLicenseNumber(request.getLicenseNumber());
            doctor.setDepartment(request.getDepartment());
            doctorRepository.save(doctor);
        } else if (request.getRole() == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setName(savedUser.getFirstName() + " " + savedUser.getLastName());
            
            // Convert date string to LocalDate and calculate age
            if (request.getDateOfBirth() != null && !request.getDateOfBirth().trim().isEmpty()) {
                try {
                    LocalDate dateOfBirth = LocalDate.parse(request.getDateOfBirth());
                    patient.setDateOfBirth(dateOfBirth);
                    
                    // Calculate age
                    int age = Period.between(dateOfBirth, LocalDate.now()).getYears();
                    patient.setAge(age);
                } catch (Exception e) {
                    // If date parsing fails, set default values
                    patient.setAge(0);
                }
            } else {
                patient.setAge(0);
            }
            
            patient.setGender(request.getGender());
            patient.setAddress(request.getAddress());
            patient.setEmergencyContact(request.getEmergencyContact());
            patientRepository.save(patient);
        }

        // Update request status
        request.setStatus(UserRegistrationRequest.Status.APPROVED);
        request.setAdminNotes(adminNotes);
        request.setProcessedAt(LocalDateTime.now());
        request.setProcessedBy(adminId);
        requestRepo.save(request);

        Map<String, Object> result = new HashMap<>();
        result.put("generatedUsername", username);
        result.put("generatedPassword", password);
        result.put("user", savedUser);
        result.put("message", "User created successfully");

        return result;
    }
    
    // Admin rejects request
    public UserRegistrationRequest rejectRequest(Long requestId, Long adminId, String adminNotes) {
        UserRegistrationRequest request = requestRepo.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (request.getStatus() != UserRegistrationRequest.Status.PENDING) {
            throw new RuntimeException("Request is not pending");
        }
        
        request.setStatus(UserRegistrationRequest.Status.REJECTED);
        request.setAdminNotes(adminNotes);
        request.setProcessedAt(LocalDateTime.now());
        request.setProcessedBy(adminId);
        
        return requestRepo.save(request);
    }
    
    // Admin creates user directly (bypassing request system)
    public User createUserDirectly(AdminCreateUserDTO dto, Long adminId) {
        // Check if email already exists
        if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Generate or use custom credentials
        String username = dto.getCustomUsername() != null ? 
            dto.getCustomUsername() : generateUsername(dto.getFirstName(), dto.getLastName());
        
        String password = dto.getCustomPassword() != null ? 
            dto.getCustomPassword() : generateDefaultPassword();
        
        // Create user
        User user = new User(
            username,
            passwordEncoder.encode(password),
            dto.getEmail(),
            dto.getFirstName(),
            dto.getLastName(),
            dto.getPhoneNumber() != null ? dto.getPhoneNumber() : "", // Add phone number
            Role.valueOf(dto.getRole())
        );
        user.setStatus(User.Status.APPROVED); // Ensure approved users have correct status
        
        // Save user
        User savedUser = userRepo.save(user);
        
        // Return user with generated credentials
        savedUser.setPassword(password); // Return plain password for admin to see
        return savedUser;
    }
    
    // Generate default username
    private String generateUsername(String firstName, String lastName) {
        String baseUsername = (firstName + lastName).toLowerCase().replaceAll("[^a-z0-9]", "");
        String username = baseUsername;
        int counter = 1;
        
        // Keep trying until we find a unique username
        while (userRepo.findByUsername(username).isPresent()) {
            username = baseUsername + counter;
            counter++;
        }
        
        return username;
    }

    private String generateUsername(String firstName, String lastName, Role role) {
        String baseUsername = (firstName + lastName).toLowerCase().replaceAll("[^a-z0-9]", "");
        String username = baseUsername;
        int counter = 1;

        // Keep trying until we find a unique username
        while (userRepo.findByUsername(username).isPresent()) {
            username = baseUsername + counter;
            counter++;
        }

        return username;
    }
    
    // Generate default password
    private String generateDefaultPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        Random random = new Random();
        
        // Generate 8-character password
        for (int i = 0; i < 8; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return password.toString();
    }
    
    // Get all requests
    public List<UserRegistrationRequest> getAllRequests() {
        return requestRepo.findAll();
    }
    
    // Get requests by status
    public List<UserRegistrationRequest> getRequestsByStatus(UserRegistrationRequest.Status status) {
        return requestRepo.findByStatus(status);
    }
    
    // Count requests by status
    public long countRequestsByStatus(UserRegistrationRequest.Status status) {
        return requestRepo.countByStatus(status);
    }
    
    // Find requests by status
    public List<UserRegistrationRequest> findByStatus(UserRegistrationRequest.Status status) {
        return requestRepo.findByStatus(status);
    }
    
    // Find request by ID
    public UserRegistrationRequest findById(Long id) {
        return requestRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Request not found"));
    }
    
    // Save request
    public UserRegistrationRequest save(UserRegistrationRequest request) {
        return requestRepo.save(request);
    }
}
