package com.Medicare.controller;

import com.Medicare.Enums.ReservationStatus;
import com.Medicare.dto.ReservationDTO;
import com.Medicare.dto.ReservationRequestDTO;
import com.Medicare.model.Reservation;
import com.Medicare.repository.ReservationRepository;
import com.Medicare.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
public class ReservationController {
    private ReservationService reservationService;
    private ReservationRepository reservationRepository;

    public ReservationController(ReservationService reservationService, ReservationRepository reservationRepository) {
        this.reservationService = reservationService;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("/api/public/reservation")
    @Tag(name = "Reservation")
    @Operation(summary = "Retrieve all reservations List", description = "Retrieve all reservations List")
    public List<ReservationDTO> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @PostMapping("/api/public/reservation")
    @Tag(name = "Reservation")
    @Operation(
            summary = "Create a new reservation",
            description = "Create a new reservation.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Patient object to be created",

            content = @io.swagger.v3.oas.annotations.media.Content(
                    mediaType = "application/json",
            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    name = "Patient Example",
            value = "{\n" +
                    "  \"status\": \"Confirmed\",\n" +
                    "  \"visitPurpose\": \"string\",\n" +
                    "  \"duration\": 30,\n" +
                    "  \"date\": \"2025-04-20T00:53:16.404Z\",\n" +
                    "  \"doctorId\": 1073741824,\n" +
                    "  \"createdAt\": \"2025-04-20T00:53:16.404Z\"\n" +
                    "}"
    )
        )
                )
                )
//    TODO: add a pathvariable for the doctorId
    public ResponseEntity<?> CreateReservation(@RequestBody ReservationRequestDTO request) {
        return reservationService.CreateReservation(request);
    }

    @GetMapping("/api/public/patient-reservation")
    @Tag(name = "Reservation")
    @Operation(summary = "Retrieve patient reservations", description = "Retrieve patient reservations")
    public ResponseEntity<?> getPatientReservations() {

        return ResponseEntity.ok(reservationService.getPatientReservations());
    }

    @GetMapping("/api/public/doctor-reservation")
    @Tag(name = "Reservation")
    @Operation(summary = "Retrieve doctor reservations", description = "Retrieve doctor reservations")
    public ResponseEntity<?> getDoctorReservations() {

        return ResponseEntity.ok(reservationService.getDoctorReservations());
    }

    @PostMapping ("/api/public/Cancel-reservation")
    @Tag(name = "Reservation")
    @Operation(summary = "Cancel reservation for the Logged in User", description = "Cancel reservation for the Logged in User")
    public ResponseEntity<?> CancelReservation(@RequestBody ReservationRequestDTO request) {
        return reservationService.CancelReservationRequest(request);
    }

    @Tag(name = "Admin-Reservation")
    @Operation(summary = "Retrieve reservation List for a Specified ID", description = "Retrieve reservation List for a Specified ID")
    @GetMapping("/api/public/reservation/{Id}")
    public ResponseEntity<?> getReservationsByIdAdmin(@PathVariable Integer Id) {
        return ResponseEntity.ok(reservationService.getReservationsByIdAdmin(Id));
    }


    @GetMapping("/api/public/reservation/count")
    public ResponseEntity<Long> getReservationCountByDate(
            @RequestParam("date") @DateTimeFormat(pattern = "M/d/yyyy") LocalDate date,
            @RequestParam("doctorId") Integer doctorId) {
        long count = reservationRepository.findAllByDateAndDoctorId(date, doctorId).size();
        return ResponseEntity.ok(count);
    }

    @PostMapping("/api/public/reservation/updatestatus")
    public ResponseEntity<?> updateReservationStatus(
            @RequestParam("id") Integer id,
            @RequestParam("status") String status) {

        return reservationService.updateReservationStatus(id, status);
    }
}
