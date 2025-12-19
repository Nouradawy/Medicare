package com.Medicare.repository;
import com.Medicare.Enums.ReservationStatus;
import com.Medicare.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByPatientId(Integer patientId);
    List<Reservation> findByDoctorId(Integer doctorId);
    List<Reservation> findByDoctorIdAndStatus(Integer doctorId, ReservationStatus status);
    @Query("SELECT r FROM Reservation r WHERE DATE(r.date) = :date AND r.doctorId = :doctorId")
    List<Reservation> findAllByDateAndDoctorId(LocalDate date, Integer doctorId);
    @Query("SELECT r FROM Reservation r WHERE DATE(r.date) = :date AND r.doctorId = :doctorId AND r.queueNumber > :queueNumber ORDER BY r.queueNumber")
    List<Reservation> findByDateAndDoctorIdAndQueueNumberGreaterThanOrderByQueueNumber(
            @Param("date") LocalDate date,
            @Param("doctorId") Integer doctorId,
            @Param("queueNumber") Integer queueNumber
    );
}