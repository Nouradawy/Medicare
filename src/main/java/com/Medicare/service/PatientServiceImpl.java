package com.Medicare.service;

import com.Medicare.model.Patient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PatientServiceImpl implements  PatientService
{
    private List<Patient> PatientsList = new ArrayList<>();

    @Override
    public List<Patient> getAllPatients() {
        return PatientsList;
    }

    @Override
    public void CreatePatients(Patient patient) {
        PatientsList.add(patient);

    }
}
