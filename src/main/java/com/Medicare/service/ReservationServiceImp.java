package com.Medicare.service;

import com.Medicare.Enums.ReservationStatus;
import com.Medicare.model.Patient;
import com.Medicare.model.Reservation;

import com.Medicare.model.User;
import com.Medicare.repository.ReservationRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ReservationServiceImp implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation CreateReservation(Reservation reservation) {
//        AuthTokenFilter not properly setting the Authentication object in the SecurityContextHolder.
//        This happens because the request is rejected before reaching the ReservationServiceImp.CreateReservation method
//        due to a HttpMessageNotReadableException thrown by Spring when it fails to deserialize the invalid ReservationStatus.

        // Fetch the logged-in user ID
        Long userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Fetch the Patient entity associated with the User
        Patient existingPatient = user.getPatient();
        if (existingPatient == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found for the logged-in user");
        }



        Long PatiendId =existingPatient.getPatientId();

        reservation.setPatientId(Math.toIntExact(PatiendId));

        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getReservationsById() {
        //TODO:Add if Statement to check userRole if it's patient or doctor ,
        // if it's doctor then get the doctors reservations

        // Fetch the logged-in user ID
        Long userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Fetch the Patient entity associated with the User
        Patient existingPatient = user.getPatient();
        if (existingPatient == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found for the logged-in user");
        }



        Integer PatiendId = Math.toIntExact(existingPatient.getPatientId());

        return reservationRepository.findByPatientId(PatiendId);
    }
}
