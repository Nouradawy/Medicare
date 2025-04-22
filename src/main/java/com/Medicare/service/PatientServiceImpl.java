package com.Medicare.service;

import com.Medicare.dto.UserRequestDTO;
import com.Medicare.model.*;
import com.Medicare.repository.PatientRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PatientServiceImpl implements  PatientService
{
//    private List<Patient> PatientsList = new ArrayList<>();

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Patient> getAllPatients() {
        Integer userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }
        return patientRepository.findAll();
    }

    @Override
    public Patient UpdatePatientById(Patient patient, Integer Id) {
        if(GetPatientById(Id) != null) {
            Patient existingPatient = GetPatientById(Id);
            return patientRepository.save(existingPatient);
        }
        return null;
    }

    @Override
    public String DeletePatient(Integer Id) {
        return "";
    }

    @Override
    public Patient GetPatientById(Integer Id) {
        return patientRepository.findById(Id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Patient not found"));
    }


    @Override
    public Patient CreatePatients(Patient patient ) {
        return patientRepository.save(patient);

}

    @Override
    public Patient AddPatientInfo(UserRequestDTO userRequestDTO) {


        // Fetch the logged-in user ID
        Integer userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Fetch the Patient entity associated with the User
        Patient existingPatient = user.getPatient();
        if (existingPatient == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found for the logged-in user");
        }

        // Clear existing collections
        existingPatient.getAllergy().clear();
        existingPatient.getMedicalHistory().clear();
        existingPatient.getChronicDiseases().clear();
        existingPatient.getDrugHistory().clear();

        // Add new items to the existing collections
        for (Allergy allergy : userRequestDTO.getAllergies()) {
            allergy.setId(userId);
            allergy.setPatient(existingPatient);
            existingPatient.getAllergy().add(allergy);
        }
        for (DrugHistory drugHistory : userRequestDTO.getDrugHistories()) {
            drugHistory.setId(userId);
            drugHistory.setPatient(existingPatient);
            existingPatient.getDrugHistory().add(drugHistory);
        }
        for (MedicalHistory medicalHistory : userRequestDTO.getMedicalHistories()) {
            medicalHistory.setId(userId);
            medicalHistory.setPatient(existingPatient);

            existingPatient.getMedicalHistory().add(medicalHistory);
        }
        for (ChronicDisease chronicDisease : userRequestDTO.getChronicDiseases()) {
            chronicDisease.setId(userId);
            chronicDisease.setPatient(existingPatient);
            existingPatient.getChronicDiseases().add(chronicDisease);
        }

        return patientRepository.save(existingPatient);
    }
}
