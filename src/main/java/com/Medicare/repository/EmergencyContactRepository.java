package com.Medicare.repository;
import com.Medicare.model.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Integer> {
    Optional<EmergencyContact> findByUser_UserId(Integer userId);

}