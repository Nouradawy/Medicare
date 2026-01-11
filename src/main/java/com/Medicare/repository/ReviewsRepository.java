package com.Medicare.repository;

import com.Medicare.dto.ReviewsDTO;
import com.Medicare.model.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, Integer> {
    List<Reviews> findByDoctorId(Integer doctorId);
    Optional<Reviews> findByReservationId(Integer reservationId);
    List<Reviews>  findByPatientId(Integer userId);
}