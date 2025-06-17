package com.Medicare.dto;

import com.Medicare.Enums.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Timestamp;

@Getter
@Setter
public class ReservationRequestDTO {
    private Integer id;
    private ReservationStatus status;
    private String visitPurpose;
    private Integer duration;
    private Timestamp date;
    private Integer doctorId;
    private Timestamp createdAt;
    private Integer patientId;
    private Integer queueNumber;
}


