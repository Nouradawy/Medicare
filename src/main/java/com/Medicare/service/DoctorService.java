package com.Medicare.service;

import com.Medicare.dto.DoctorDTO;
import com.Medicare.model.Doctor;



import java.util.List;

public interface DoctorService {
    List<Doctor> getAllDoctors();
    Doctor CreateDoctor(DoctorDTO doctorDTO);

}

