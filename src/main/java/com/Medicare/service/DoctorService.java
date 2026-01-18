package com.Medicare.service;

import com.Medicare.dto.DoctorDTO;
import com.Medicare.dto.UserRequestDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.User;
import org.springframework.web.bind.annotation.RequestBody;


import java.util.List;
import java.util.Optional;
import com.Medicare.Enums.DoctorStatus;

public interface DoctorService {
    List<DoctorDTO> getAllDoctors();
    Doctor CreateDoctor(DoctorDTO doctorDTO);
    Optional<Doctor> GetDoctorInformation();
    List<DoctorDTO> getDoctorsByStatus(DoctorStatus status);
    Doctor updateDoctorStatus(Integer doctorId, DoctorStatus status);
    User EditPatientInfo(UserRequestDTO userRequestDTO);
    User DeleteMedicalRecord(Integer id, String Type, Integer patientId);
    Doctor UpdateServingNumber(Integer ServingNumber);

}

