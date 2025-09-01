package com.medvault.service;

import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Profile({"dev", "test"})
public class TestDataService {

    private final JdbcTemplate jdbcTemplate;

    public TestDataService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public void clearTestData() {
        // Disable FK checks, truncate in safe order, then enable FK checks
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=0");

        // Truncate child tables first to satisfy FK constraints
        // Adjust table names if they differ from entity naming strategy
        jdbcTemplate.execute("TRUNCATE TABLE appointments");
        jdbcTemplate.execute("TRUNCATE TABLE medical_records");
        jdbcTemplate.execute("TRUNCATE TABLE doctors");
        jdbcTemplate.execute("TRUNCATE TABLE patients");
        jdbcTemplate.execute("TRUNCATE TABLE user_registration_requests");
        jdbcTemplate.execute("TRUNCATE TABLE user");

        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1");
    }
}


