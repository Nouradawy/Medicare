package com.Medicare.dto;

import com.Medicare.Enums.EBloodType;
import com.Medicare.Enums.EGender;
import com.Medicare.model.Allergy;
import com.Medicare.model.ChronicDisease;
import com.Medicare.model.DrugHistory;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
public class PatientPublicDTO {
    private Integer userId;
    private String fullName;
    private Date dateOfBirth;
    private EGender gender;
    private EBloodType bloodType;
    private String phoneNumber;
    private String nationalId;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;
    private List<DrugHistory> drugHistory;
    private List<Allergy> allergy;
    private List<ChronicDisease> chronicDiseases;
    // Medical history is intentionally excluded for public access
}
