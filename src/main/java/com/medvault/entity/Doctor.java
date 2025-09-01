package com.medvault.entity;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialization;
    
    @Column(name = "license_number")
    private String licenseNumber;
    
    private String department;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // -------- Getters and Setters --------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}