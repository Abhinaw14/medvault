// PatientService.java
package com.medvault.service;

import com.medvault.dto.PatientDTO;
import com.medvault.entity.Patient;
import com.medvault.repository.PatientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientService {
    private final PatientRepository repo;

    public PatientService(PatientRepository repo) { this.repo = repo; }

    public List<Patient> getAllPatients() { return repo.findAll(); }
    public Patient getPatientById(Long id) { return repo.findById(id).orElse(null); }
    public Patient createPatient(Patient patient) { return repo.save(patient); }
    public void deletePatient(Long id) { repo.deleteById(id); }
    // PatientService.java (add this method)
    public PatientDTO convertToDTO(Patient patient) {
        String username = (patient.getUser() != null) ? patient.getUser().getUsername() : null;
        return new PatientDTO(
                patient.getId(),
                patient.getName(),
                patient.getAge(),
                patient.getGender(),
                username
        );
    }

    public List<PatientDTO> getAllPatientsDTO() {
        return repo.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public PatientDTO getPatientByIdDTO(Long id) {
        return repo.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

}
