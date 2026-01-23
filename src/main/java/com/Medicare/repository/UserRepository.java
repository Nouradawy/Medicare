package com.Medicare.repository;
import com.Medicare.Enums.AccountStatus;
import com.Medicare.Enums.ERole;
import com.Medicare.model.Doctor;
import com.Medicare.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByNationalId(String nationalId);
    Optional<User> findByUserId(Integer userId);
    
    // Search by fullName, email, or username (case-insensitive)
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.FullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);
    
    // Search with role filter
    @Query("SELECT u FROM User u JOIN u.roles r WHERE " +
           "r.name = :role AND (" +
           "LOWER(u.FullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchUsersByRole(@Param("search") String search, @Param("role") ERole role, Pageable pageable);
    
    // Filter by role only
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :role")
    Page<User> findByRole(@Param("role") ERole role, Pageable pageable);
    List<Doctor> findByStatus(AccountStatus status);

    Page<Doctor> findByStatus(AccountStatus status, Pageable pageable);
    long countByStatus(AccountStatus status);
}