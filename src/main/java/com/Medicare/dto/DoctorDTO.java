package com.Medicare.dto;
import java.time.LocalTime;
import com.Medicare.Enums.DoctorStatus;
import java.time.format.DateTimeFormatter;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
@Getter
@Setter
public class DoctorDTO {
    private Integer doctorId;
    private String username;
    private String FullName;
    private String specialty;
    private String City;
    private String Address;
    private String specialityDetails;
    private float Fees;
    private Integer Rating;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<String> workingDays;
    private List<String> Vacations;
    private DoctorStatus status;
    private String address;
    private String bio;

    // Getters and Setters
}