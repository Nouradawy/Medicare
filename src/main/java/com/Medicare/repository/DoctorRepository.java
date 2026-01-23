package com.Medicare.repository;

import com.Medicare.model.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.Medicare.Enums.AccountStatus;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

    @Query("SELECT d FROM Doctor d WHERE d.user.status = :status")
    Page<Doctor> findByUserStatus(@Param("status") AccountStatus status, Pageable pageable);

    @Query("SELECT COUNT(d) FROM Doctor d WHERE d.user.status = :status")
    long countByUserStatus(@Param("status") AccountStatus status);

}
