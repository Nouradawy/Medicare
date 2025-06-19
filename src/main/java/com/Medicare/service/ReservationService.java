package com.Medicare.service;
import com.Medicare.dto.ReservationDTO;
import com.Medicare.dto.ReservationRequestDTO;
import com.Medicare.model.Reservation;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface ReservationService {
    List<Reservation> getAllReservations();
    ResponseEntity<?> CreateReservation(ReservationRequestDTO request);
    ResponseEntity<?> CancelReservationRequest(ReservationRequestDTO request);
    List<ReservationDTO> getPatientReservations();
    List<ReservationDTO> getDoctorReservations();
    List<Reservation> getReservationsByIdAdmin(Integer Id);
    ResponseEntity<?> updateReservationStatus(Integer id, String status);
}
