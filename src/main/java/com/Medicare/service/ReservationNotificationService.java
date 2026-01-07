package com.Medicare.service;

import com.Medicare.model.Reservation;
import com.Medicare.model.User;
import com.Medicare.repository.ReservationRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.controller.NotificationController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ReservationNotificationService {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationController notificationController;

    @Transactional(readOnly = true)
    // Runs every day at 8 AM
    @Scheduled(cron = "0 34 8 * * *", zone = "Africa/Cairo")
    public void notifyUpcomingReservations() {
        System.err.println("THE  APP IS  STARTING SO THE SSYTEM  SECURITY  IS  BEING  ADDED");
        LocalDate tomorrow = LocalDate.now(ZoneId.of("Africa/Cairo")).plusDays(1);
        List<Reservation> reservations = reservationRepository.findAll();

        for (Reservation reservation : reservations) {
            if (reservation.getDate() == null) continue;
            LocalDate reservationDate = reservation.getDate().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();

            if (reservationDate.equals(tomorrow)) {
                ZonedDateTime zdt = reservation.getDate().toInstant().atZone(ZoneId.of("Africa/Cairo"));
                String timeAmPm = zdt.format(DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH));
                String doctorName = reservation.getDoctor() != null ? reservation.getDoctor().getUser().getFullName() : "your doctor";
                User user = reservation.getUser();
                if (user != null && user.getPushSubscription() != null) {
                    Map<String, String> payload = new HashMap<>();
                    payload.put("title", "Reservation Reminder");
                    payload.put("message", "your reservation   with Dr."+ doctorName +" is scheduled for tomorrow at" + timeAmPm);
                    payload.put("url", "http://localhost:5173/reservation/"+ reservation.getId());

                    try {
                        notificationController.sendPush(payload  , user.getUserId());
                    } catch (Exception e) {
                        System.err.println("Failed to send push for user " + user.getUsername() + ": " + e.getMessage());
                        // Handle exception (log, etc.)
                    }
                }
            }
        }
    }
}