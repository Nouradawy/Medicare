package com.Medicare.service;

import com.Medicare.model.Reservation;
import com.Medicare.model.User;
import com.Medicare.repository.ReservationRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.controller.NotificationController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class ReservationNotificationService {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationController notificationController;

    // Runs every day at 8 AM
    @Scheduled(cron = "0 0 8 * * *")
    public void notifyUpcomingReservations() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Reservation> reservations = reservationRepository.findAll();

        for (Reservation reservation : reservations) {
            if (reservation.getDate() == null) continue;
            LocalDate reservationDate = reservation.getDate().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();
            if (reservationDate.equals(tomorrow)) {
                User user = reservation.getUser();
                if (user != null && user.getPushSubscription() != null) {
                    Map<String, String> payload = new HashMap<>();
                    payload.put("message", "You have a reservation tomorrow!");
                    try {
                        notificationController.sendPush(payload);
                    } catch (Exception e) {
                        // Handle exception (log, etc.)
                    }
                }
            }
        }
    }
}