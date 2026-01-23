package com.Medicare.service;

import com.Medicare.dto.DoctorDTO;
import com.Medicare.dto.UserRequestDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.User;


import java.util.List;
import java.util.Optional;
import com.Medicare.Enums.AccountStatus;

public interface DoctorService {
    List<DoctorDTO> getAllDoctors();
    Doctor CreateDoctor(DoctorDTO doctorDTO);
    Optional<Doctor> GetDoctorInformation();
    List<DoctorDTO> getDoctorsByStatus(AccountStatus status);
    Doctor updateDoctorStatus(Integer doctorId, AccountStatus status);
    User AddNewMedicalRecord(UserRequestDTO userRequestDTO);
    User EditPatientInfo(UserRequestDTO userRequestDTO);
    User DeleteMedicalRecord(Integer id, String Type, Integer patientId);
    Doctor UpdateServingNumber(Integer ServingNumber);
}

