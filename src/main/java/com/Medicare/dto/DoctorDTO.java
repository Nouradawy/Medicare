package com.Medicare.dto;

import com.Medicare.Enums.DoctorStatus;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;
@Getter
@Setter
public class DoctorDTO {
    private String specialty;
    private Timestamp startTime;
    private Timestamp endTime;
    private List<String> workingDays;
    private DoctorStatus status;

    // Getters and Setters
}