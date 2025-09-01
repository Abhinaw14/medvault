package com.medvault.repository;

import com.medvault.entity.User;
import com.medvault.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByStatus(User.Status status);
    Optional<User> findFirstByRole(Role role);
    long countByRole(Role role);
}
