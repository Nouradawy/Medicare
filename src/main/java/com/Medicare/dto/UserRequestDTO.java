package com.Medicare.dto;

import com.Medicare.model.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class UserRequestDTO {

    private List<Allergy> allergies;
    private List<ChronicDisease> chronicDiseases;
    private List<DrugHistory> drugHistories;
    private List<MedicalHistory> medicalHistories;

}
