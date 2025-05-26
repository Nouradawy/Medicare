package com.Medicare.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.sql.Timestamp;
@Getter
@Setter
public class ReservationDTO {
    private Integer id;
    private Integer patientId;
    private Integer doctorId;
    private DoctorDTO doctor;
    private UserUpdateDTO user;
    private String status;
    private String visitPurpose;
    private Integer duration;
    private Date date;
    private Timestamp createdAt;
}
