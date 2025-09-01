package com.medvault.repository;

import com.medvault.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    // custom queries if needed
    Patient findByName(String name);
}

