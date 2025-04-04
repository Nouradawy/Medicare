package com.Medicare.service;

import com.Medicare.dto.UserRequestDTO;
import com.Medicare.model.Patient;
import com.Medicare.model.User;

import java.util.List;
import java.util.Optional;


public interface PatientService{
    List<Patient> getAllPatients();
    Patient UpdatePatientById(Patient patient, Long Id);
    String DeletePatient(Long Id);
    Patient GetPatientById(Long Id);
    Patient CreatePatients(Patient patient);
    Patient AddPatientInfo(UserRequestDTO userRequestDTO);
}

