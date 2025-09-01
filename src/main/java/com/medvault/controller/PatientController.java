package com.medvault.controller;

import com.medvault.dto.PatientDTO;
import com.medvault.entity.Patient;
import com.medvault.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
    // PatientController.java
    @RestController
    @RequestMapping("/api/patients")
    public class PatientController {
        @Autowired
        private PatientService service;

        @GetMapping
        public List<PatientDTO> getAll() {
            return service.getAllPatientsDTO();
        }

        @GetMapping("/{id}")
        public PatientDTO getById(@PathVariable Long id) {
            return service.getPatientByIdDTO(id);
        }

        @PostMapping
        public PatientDTO create(@RequestBody Patient patient) {
            Patient saved = service.createPatient(patient);
            return service.convertToDTO(saved); // returning DTO
        }

        @DeleteMapping("/{id}")
        public void delete(@PathVariable Long id) {
            service.deletePatient(id);
        }
    }
