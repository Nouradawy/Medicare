package com.Medicare.service;

import com.Medicare.Enums.ReservationStatus;
import com.Medicare.dto.ReservationRequestDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.Reservation;

import com.Medicare.model.User;
import com.Medicare.repository.DoctorRepository;
import com.Medicare.repository.ReservationRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

@Service
public class ReservationServiceImp implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public ResponseEntity<?> CreateReservation(ReservationRequestDTO request) {
//        AuthTokenFilter not properly setting the Authentication object in the SecurityContextHolder.
//        This happens because the request is rejected before reaching the ReservationServiceImp.CreateReservation method
//        due to a HttpMessageNotReadableException thrown by Spring when it fails to deserialize the invalid ReservationStatus.

        // Fetch the logged-in user ID
        Integer userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));

        Reservation reservation = new Reservation();
        reservation.setDoctor(doctor); // Set the Doctor object
        reservation.setDoctorId(doctor.getUserId());
        reservation.setStatus(request.getStatus());
        reservation.setVisitPurpose(request.getVisitPurpose());
        reservation.setDuration(request.getDuration());
        reservation.setDate(request.getDate());
        reservation.setCreatedAt(request.getCreatedAt());
        reservation.setPatientId(userId);
        reservationRepository.save(reservation);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Collections.singletonMap("message", "Reservation cancelled successfully!"));

    }

    @Override
    public ResponseEntity<?> CancelReservationRequest(ReservationRequestDTO request) {
        Integer userId = JwtUtils.getLoggedInUserId();


            Reservation reservation = reservationRepository.findById(request.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));

            reservation.setStatus(request.getStatus());
            reservationRepository.save(reservation);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(Collections.singletonMap("message", "Reservation cancelled successfully!"));

    }

    @Override
    public List<Reservation> getReservationsById() {
        //TODO:Add if Statement to check userRole if it's patient or doctor ,
        // if it's doctor then get the doctors reservations

        // Fetch the logged-in user ID
        Integer userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));



        return reservationRepository.findByPatientId(userId);
    }
    @Override
    public List<Reservation> getReservationsByIdAdmin(Integer Id) {
        //TODO: Implement a method to check if the user is a doctor or patient
        return reservationRepository.findByPatientId(Id);
    }
}
