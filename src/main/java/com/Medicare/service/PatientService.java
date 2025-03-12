package com.Medicare.service;


import com.Medicare.model.Patient;

import java.util.List;


public interface PatientService{
    List<Patient> getAllPatients();

    void CreatePatients (Patient patient);
}

