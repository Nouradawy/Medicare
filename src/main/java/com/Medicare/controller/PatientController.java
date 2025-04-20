package com.Medicare.controller;

import com.Medicare.dto.UserRequestDTO;
import com.Medicare.model.Patient;
import com.Medicare.service.PatientService;
import com.Medicare.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
public class PatientController {

    private PatientService patientService;
    private UserService userService;


    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }


    @GetMapping("/api/public/patient")
    @Tag(name = "patient")
    @Operation(summary = "Retrieve all registered patients",description = "Retrieve all registered patients .")
    public ResponseEntity<?> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }


    @Tag(name = "patient")
    @Operation(summary = "add or edit patient info ex: allergies, drug histories",
            description = "POST method For Adding Patient additional information based on logged in User ex: allergies, chronic diseases, drug histories, medical histories")
    @PostMapping("/api/public/patient/Info")
    public ResponseEntity<?> AddPatientInfo(@RequestBody UserRequestDTO userRequestDTO ) {
        Patient savedPatient = patientService.AddPatientInfo(userRequestDTO );
        return ResponseEntity.ok(savedPatient);
    }

}

