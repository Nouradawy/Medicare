package com.Medicare.controller;

import com.Medicare.model.Reservation;
import com.Medicare.repository.ReservationRepository;
import com.Medicare.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReservationController {
    private ReservationService reservationService;
    private ReservationRepository reservationRepository;

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

    @GetMapping("/api/public/reservation/{patientId}")
    public ResponseEntity<?> getReservationsByPatientId(@PathVariable Integer patientId) {

        return ResponseEntity.ok(reservationService.getReservationsByPatientId(patientId));
    }
}
