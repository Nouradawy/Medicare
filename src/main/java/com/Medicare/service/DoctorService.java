package com.Medicare.service;

import com.Medicare.dto.DoctorDTO;
import com.Medicare.model.Doctor;
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


}

