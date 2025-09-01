// MedicalRecordService.java
package com.medvault.service;

import com.medvault.entity.MedicalRecord;
import com.medvault.repository.MedicalRecordRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MedicalRecordService {
    private final MedicalRecordRepository repo;

    public MedicalRecordService(MedicalRecordRepository repo) { this.repo = repo; }

    public List<MedicalRecord> getAllRecords() { return repo.findAll(); }
    public MedicalRecord getRecordById(Long id) { return repo.findById(id).orElse(null); }
    public MedicalRecord createRecord(MedicalRecord record) { return repo.save(record); }
    public void deleteRecord(Long id) { repo.deleteById(id); }
}
