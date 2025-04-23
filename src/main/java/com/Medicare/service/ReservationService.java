package com.Medicare.service;
import com.Medicare.dto.ReservationRequestDTO;
import com.Medicare.model.Reservation;
import java.util.List;


public interface ReservationService {
    List<Reservation> getAllReservations();
    Reservation CreateReservation(ReservationRequestDTO request);
    List<Reservation> getReservationsById();
    List<Reservation> getReservationsByIdAdmin(Integer Id);
}
