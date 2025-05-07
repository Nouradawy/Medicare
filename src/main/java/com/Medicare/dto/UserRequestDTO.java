package com.Medicare.dto;

import com.Medicare.model.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class UserRequestDTO {

    @Schema(description = "List of allergies", example = "[{\"allergy\": \"Peanuts\", \"description\": \"Severe allergic reaction to peanuts\"}]")
    private List<Allergy> allergies;
    @Schema(description = "List of chronic diseases", example = "[{\"name\": \"Diabetes\", \"description\": \"Type 2 Diabetes\"}]")
    private List<ChronicDisease> chronicDiseases;

    @Schema(description = "List of drug histories", example = "[{\"drugName\": \"Metformin\"}]")
    private List<DrugHistory> drugHistories;

    @Schema(description = "List of medical histories", example = "[{\"date\": \"2023-01-01\", \"description\": \"Hypertension\"}]")
    private List<MedicalHistory> medicalHistories;

}

