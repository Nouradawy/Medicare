package com.Medicare.dto;

import com.Medicare.Enums.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class ReservationRequestDTO {
    private ReservationStatus status;
    private String visitPurpose;
    private Integer duration;
    private Timestamp date;
    private Integer doctorId;
    private Timestamp createdAt;
}
