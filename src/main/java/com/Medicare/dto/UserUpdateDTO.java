package com.Medicare.dto;

import com.Medicare.Enums.DoctorStatus;
import com.Medicare.Enums.ECity;
import com.Medicare.Enums.EGender;
import com.Medicare.model.Allergy;
import com.Medicare.model.ChronicDisease;
import com.Medicare.model.DrugHistory;
import com.Medicare.model.MedicalHistory;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class UserUpdateDTO {
    private String username;
    private String FullName;
    private Integer CityId;
    private String Address;
    private EGender Gender;
    private Date DateOfBirth;
    private Integer Age;
    private String email;
    private List<Allergy> allergies;
    private List<ChronicDisease> chronicDiseases;
    private List<DrugHistory> drugHistories;
    private List<MedicalHistory> medicalHistories;

    // Getters and Setters
}