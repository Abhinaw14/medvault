package com.medvault.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medvault.entity.Doctor;
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
