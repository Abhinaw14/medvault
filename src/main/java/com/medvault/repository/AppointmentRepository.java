package com.medvault.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medvault.entity.Appointment;
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
