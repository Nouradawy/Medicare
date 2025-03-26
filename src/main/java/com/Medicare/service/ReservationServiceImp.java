package com.Medicare.service;

import com.Medicare.model.Reservation;
import com.Medicare.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationServiceImp implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation CreateReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getReservationsByPatientId(Integer patientId) {
        return reservationRepository.findByPatientId(patientId);
    }
}
