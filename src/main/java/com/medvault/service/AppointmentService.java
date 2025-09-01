// AppointmentService.java
package com.medvault.service;

import com.medvault.entity.Appointment;
import com.medvault.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) { this.repo = repo; }

    public List<Appointment> getAllAppointments() { return repo.findAll(); }
    public Appointment getAppointmentById(Long id) { return repo.findById(id).orElse(null); }
    public Appointment createAppointment(Appointment appointment) { return repo.save(appointment); }
    public void deleteAppointment(Long id) { repo.deleteById(id); }
}
