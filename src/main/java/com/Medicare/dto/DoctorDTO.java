package com.Medicare.dto;
import java.time.LocalDateTime;
import java.time.LocalTime;
import com.Medicare.Enums.DoctorStatus;
import java.time.format.DateTimeFormatter;

import com.Medicare.Enums.EGender;
import com.Medicare.model.Reservation;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class DoctorDTO {
    private Integer userId;
    private Integer doctorId;
    private String username;
    private String FullName;
    private String specialty = "Cardiology";
    private String City;
    private String Address;
    private String specialityDetails = "Expert in heart-related treatments";
    private float Fees =  150;
    private Integer Rating = 4;
    private LocalTime startTime = LocalTime.parse("09:00");
    private LocalTime endTime = LocalTime.parse("17:00");
    private List<String> workingDays = List.of("SUN", "FRI");;
    private List<String> Vacations = List.of("MON", "TUE");
    private Map<String,List<String>> DocumentsList;
    private DoctorStatus status = DoctorStatus.Pending;
    private String bio;
    private String Gender;
    private List<LocalDateTime> ReservationDates;
    private Integer servingNumber;
    private Integer visitDuration = 30; // in minutes

    // Getters and Setters
}