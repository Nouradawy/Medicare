package com.Medicare.repository;

import com.Medicare.model.PreVisits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreVisitsRepository extends JpaRepository<PreVisits, Integer> {
    Optional<PreVisits> findByReservationId(Integer reservationId);
}