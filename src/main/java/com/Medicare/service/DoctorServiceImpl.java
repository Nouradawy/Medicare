package com.Medicare.service;

import com.Medicare.Enums.ERole;
import com.Medicare.Enums.ReservationStatus;
import com.Medicare.dto.DoctorDTO;
import com.Medicare.dto.UserRequestDTO;
import com.Medicare.model.*;
import com.Medicare.repository.DoctorRepository;
import com.Medicare.repository.ReservationRepository;
import com.Medicare.repository.RoleRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import com.Medicare.Enums.DoctorStatus;

@Service
public class DoctorServiceImpl  implements DoctorService{

    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ReservationRepository reservationRepository;


    @Override
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream().map(doctor->{
            DoctorDTO doctorDTO = new DoctorDTO();
            doctorDTO.setDoctorId(doctor.getUserId());
            doctorDTO.setUsername(doctor.getUser().getUsername());
            doctorDTO.setFullName(doctor.getUser().getFullName());
            doctorDTO.setSpecialty(doctor.getSpecialty());
            doctorDTO.setSpecialityDetails(doctor.getSpecialityDetails());
            doctorDTO.setStartTime(doctor.getStartTime());
            doctorDTO.setEndTime(doctor.getEndTime());
            doctorDTO.setWorkingDays(doctor.getWorkingDays());
            doctorDTO.setStatus(doctor.getStatus());
            doctorDTO.setVacations(doctor.getVacations());
            doctorDTO.setFees(doctor.getFees());
            doctorDTO.setRating(doctor.getRating());
            doctorDTO.setCity(doctor.getUser().getCity() !=null ? String.valueOf(doctor.getUser().getCity().getName()) : "No City");
            doctorDTO.setAddress(doctor.getUser().getAddress());
            doctorDTO.setBio(doctor.getBio());
            doctorDTO.setGender(String.valueOf(doctor.getUser().getGender()));
            doctorDTO.setServingNumber(doctor.getServingNumber());

            List<LocalDateTime> pendingDates = reservationRepository
                    .findByDoctorIdAndStatus(doctor.getUserId(), ReservationStatus.Pending)
                    .stream()
                    .map(Reservation::getDate)
                    .filter(Objects::nonNull)
                    .map(d -> d.toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime())
                    .toList();
            doctorDTO.setReservationDates(pendingDates);
            return doctorDTO;
        }).toList();

    }

    @Override
    public Doctor CreateDoctor(DoctorDTO doctorDTO) {
        // Fetch the logged-in user ID
        Integer userId;
        if(doctorDTO.getUserId() == null){
            userId = JwtUtils.getLoggedInUserId();
        }
        else{
            userId = doctorDTO.getUserId();
        }

        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Fetch the Patient entity associated with the User
        Doctor existingDoctor = user.getDoctor();
        if (existingDoctor == null) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found for the logged-in user");
            // If no Patient entity is found, create a new one
            existingDoctor = new Doctor();
        }


            existingDoctor.setUser(user);
            existingDoctor.setSpecialty(doctorDTO.getSpecialty());
            existingDoctor.setStartTime(doctorDTO.getStartTime());
            existingDoctor.setEndTime(doctorDTO.getEndTime());
            existingDoctor.setWorkingDays(doctorDTO.getWorkingDays());
            existingDoctor.setStatus(doctorDTO.getStatus());
            existingDoctor.setSpecialityDetails(doctorDTO.getSpecialityDetails());
            existingDoctor.setVacations(doctorDTO.getVacations());
            existingDoctor.setFees(doctorDTO.getFees());
            existingDoctor.setRating(doctorDTO.getRating());
            existingDoctor.setVisitDuration(doctorDTO.getVisitDuration());



            //ensures that the ROLE_DOCTOR is added only if the user does not already have it.
            if(user.getRoles().stream().noneMatch(role -> role.getName().equals(ERole.ROLE_DOCTOR.name()))){
            Role doctorRole = roleRepository.findByName(ERole.ROLE_DOCTOR)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));
            user.getRoles().add(doctorRole);
        }


        return doctorRepository.save(existingDoctor);
    }

    @Override
    public Optional<Doctor> GetDoctorInformation() {
        // Fetch the logged-in user ID
        Integer userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Fetch the Patient entity associated with the User
        Doctor existingDoctor = user.getDoctor();
        if (existingDoctor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found for the logged-in user");
        }


        return doctorRepository.findById(existingDoctor.getUserId());
    }

    // No need for this API as it is already covered by getAllDoctors() and you can filter by status in the frontend
    @Override
    public List<DoctorDTO> getDoctorsByStatus(DoctorStatus status) {
        List<Doctor> doctors = doctorRepository.findByStatus(status);
        return doctors.stream().map(doctor -> {
            DoctorDTO doctorDTO = new DoctorDTO();
            doctorDTO.setDoctorId(doctor.getUserId());
            doctorDTO.setUsername(doctor.getUser().getUsername());
            doctorDTO.setFullName(doctor.getUser().getFullName());
            doctorDTO.setSpecialty(doctor.getSpecialty());
            doctorDTO.setSpecialityDetails(doctor.getSpecialityDetails());
            doctorDTO.setStartTime(doctor.getStartTime());
            doctorDTO.setEndTime(doctor.getEndTime());
            doctorDTO.setWorkingDays(doctor.getWorkingDays());
            doctorDTO.setStatus(doctor.getStatus());
            doctorDTO.setVacations(doctor.getVacations());
            doctorDTO.setFees(doctor.getFees());
            doctorDTO.setRating(doctor.getRating());
            doctorDTO.setCity(doctor.getUser().getCity() != null ? String.valueOf(doctor.getUser().getCity().getName()) : "No City");
            doctorDTO.setAddress(doctor.getUser().getAddress());
            doctorDTO.setBio(doctor.getBio());
            doctorDTO.setGender(String.valueOf(doctor.getUser().getGender()));
            return doctorDTO;
        }).toList();
    }

    // This method updates the status of a doctor by their ID
    @Override
    public Doctor updateDoctorStatus(Integer doctorId, DoctorStatus status) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setStatus(status);
        return doctorRepository.save(doctor);
    }

    @Override
    public User EditPatientInfo(UserRequestDTO userRequestDTO) {

        // Fetch the User object from the database
        User existtingUser = userRepository.findById(userRequestDTO.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        try {
            // update items to the existing collections
            if (userRequestDTO.getAllergies() != null) {
            for (Allergy allergy : userRequestDTO.getAllergies()) {
                if (allergy.getId() != null) {
                    Allergy existing = existtingUser.getAllergy().stream()
                            .filter(a -> a.getId().equals(allergy.getId()))
                            .findFirst()
                            .orElse(null);
                    if (existing != null) {

                        existing.setAllergy(allergy.getAllergy());
                        existing.setReaction(allergy.getReaction());
                        existing.setSeverity(allergy.getSeverity());

                    }
                }
            }
        }
            if (userRequestDTO.getDrugHistories() != null) {
            for (DrugHistory drugHistory : userRequestDTO.getDrugHistories()) {

                if (drugHistory.getId() != null) {
                    DrugHistory existing = existtingUser.getDrugHistory().stream()
                            .filter(d -> d.getId().equals(drugHistory.getId()))
                            .findFirst()
                            .orElse(null);

                    if (existing != null) {
                        existing.setDrugName(drugHistory.getDrugName());
                        existing.setDosage(drugHistory.getDosage());
                        existing.setFrequency(drugHistory.getFrequency());
                        existing.setDuration(drugHistory.getDuration());
                        existing.setRoute(drugHistory.getRoute());
                        existing.setPrescribingPhysician(drugHistory.getPrescribingPhysician());

                    }
                }
            }
            }
            if (userRequestDTO.getMedicalHistories() != null) {
                for (MedicalHistory incoming : userRequestDTO.getMedicalHistories()) {
                    if (incoming.getId() != null) {
                        MedicalHistory existing = existtingUser.getMedicalHistory().stream()
                                .filter(m -> m.getId().equals(incoming.getId()))
                                .findFirst()
                                .orElse(null);

                        if (existing != null) {
                            existing.setDate(incoming.getDate());
                            existing.setDescription(incoming.getDescription());
                            continue;
                        }
                    }
            }
                if (userRequestDTO.getChronicDiseases() != null) {
                    for (ChronicDisease incoming : userRequestDTO.getChronicDiseases()) {
                        if (incoming.getId() != null) {
                            ChronicDisease existing = existtingUser.getChronicDiseases().stream()
                                    .filter(c -> c.getId().equals(incoming.getId()))
                                    .findFirst()
                                    .orElse(null);

                            if (existing != null) {
                                existing.setName(incoming.getName());

                            }
                        }
                    }
                }


        }
            return userRepository.save(existtingUser);
    }catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

}

    @Override
    public User DeleteMedicalRecord(Integer id, String Type, Integer patientId) {
        User user = userRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        switch (Type) {
            case "allergies" -> {

                Allergy allergyToRemove = user.getAllergy().stream()
                        .filter(a -> a.getId().equals(id))
                        .findFirst()
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Allergy not found"));
                user.getAllergy().remove(allergyToRemove);
            }
            case "chronicDiseases" -> {

                ChronicDisease diseaseToRemove = user.getChronicDiseases().stream()
                        .filter(c -> c.getId().equals(id))
                        .findFirst()
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chronic Disease not found"));
                user.getChronicDiseases().remove(diseaseToRemove);
            }
            case "drugHistories" -> {

                DrugHistory drugHistoryToRemove = user.getDrugHistory().stream()
                        .filter(d -> d.getId().equals(id))
                        .findFirst()
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Drug History not found"));
                user.getDrugHistory().remove(drugHistoryToRemove);
            }
            case "medicalHistories" -> {
                MedicalHistory medicalHistoryToRemove = user.getMedicalHistory().stream()
                        .filter(m -> m.getId().equals(id))
                        .findFirst()
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medical History not found"));
                user.getMedicalHistory().remove(medicalHistoryToRemove);
            }
        }

        return userRepository.save(user);
    }

    @Override
    public Doctor UpdateServingNumber(Integer ServingNumber) {

        Integer doctorId = JwtUtils.getLoggedInUserId();
        if (doctorId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        try{
            doctor.setServingNumber(ServingNumber);
            return doctorRepository.save(doctor);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }
}

