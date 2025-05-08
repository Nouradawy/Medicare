package com.Medicare.service;
import com.Medicare.dto.ReservationRequestDTO;
import com.Medicare.model.Reservation;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface ReservationService {
    List<Reservation> getAllReservations();
    ResponseEntity<?> CreateReservation(ReservationRequestDTO request);
    ResponseEntity<?> CancelReservationRequest(ReservationRequestDTO request);
    List<Reservation> getReservationsById();
    List<Reservation> getReservationsByIdAdmin(Integer Id);
}
