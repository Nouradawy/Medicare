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
    private String specialty;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<String> workingDays;
    private DoctorStatus status;

    // Getters and Setters
}