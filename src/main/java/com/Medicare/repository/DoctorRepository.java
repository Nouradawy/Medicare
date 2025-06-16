package com.Medicare.repository;

import com.Medicare.model.Doctor;
import com.Medicare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.Medicare.Enums.DoctorStatus;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

    List<Doctor> findByStatus(DoctorStatus status);

}
