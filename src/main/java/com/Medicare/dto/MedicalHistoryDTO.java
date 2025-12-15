package com.Medicare.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class MedicalHistoryDTO {
    private Integer patientId;
    private Date date;
    private String description;
}
