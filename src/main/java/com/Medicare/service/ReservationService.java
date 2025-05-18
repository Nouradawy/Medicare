package com.Medicare.service;
import com.Medicare.dto.ReservationRequestDTO;
import com.Medicare.model.Reservation;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface ReservationService {
    List<Reservation> getAllReservations();
    ResponseEntity<?> CreateReservation(ReservationRequestDTO request);
    ResponseEntity<?> CancelReservationRequest(ReservationRequestDTO request);
    List<Reservation> getPatientReservations();
    List<Reservation> getDoctorReservations();
    List<Reservation> getReservationsByIdAdmin(Integer Id);
}
