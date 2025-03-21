package com.Medicare.service;

import com.Medicare.model.Patient;
import com.Medicare.model.Reservation;
import com.Medicare.repository.PatientRepository;
import com.Medicare.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientServiceImpl implements  PatientService
{
//    private List<Patient> PatientsList = new ArrayList<>();

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Patient CreatePatients(Patient patient ) {
        return patientRepository.save(patient);

}}
