package com.Medicare.controller;

import com.Medicare.model.Reservation;
import com.Medicare.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ReservationController {
    private ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/api/public/reservation")
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @PostMapping("/api/public/reservation")
    public ResponseEntity<?> CreateReservation(@RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.CreateReservation(reservation));
    }


}
