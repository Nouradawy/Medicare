package com.Medicare.service;

import com.Medicare.dto.DoctorDTO;
import com.Medicare.dto.ReservationDTO;
import com.Medicare.dto.ReservationRequestDTO;
import com.Medicare.dto.UserUpdateDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.Reservation;

import com.Medicare.model.User;
import com.Medicare.repository.DoctorRepository;
import com.Medicare.repository.ReservationRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;




@Service
public class ReservationServiceImp implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }


    @Transactional
    public void updateQueueNumbersAfterCancellation(Timestamp date, Integer doctorId, Integer canceledQueueNumber) {
        LocalDate localDate = date.toLocalDateTime().toLocalDate();
        List<Reservation> reservations = reservationRepository
                .findByDateAndDoctorIdAndQueueNumberGreaterThanOrderByQueueNumber(localDate, doctorId, canceledQueueNumber);

        for (Reservation reservation : reservations) {
            reservation.setQueueNumber(reservation.getQueueNumber() - 1);
        }
        reservationRepository.saveAll(reservations);
    }
    @Override
    public ResponseEntity<?> CreateReservation(ReservationRequestDTO request) {
//        AuthTokenFilter not properly setting the Authentication object in the SecurityContextHolder.
//        This happens because the request is rejected before reaching the ReservationServiceImp.CreateReservation method
//        due to a HttpMessageNotReadableException thrown by Spring when it fails to deserialize the invalid ReservationStatus.

        // Fetch the logged-in user ID
        Integer userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));

        Reservation reservation = new Reservation();
        reservation.setDoctor(doctor); // Set the Doctor object
        reservation.setDoctorId(doctor.getUserId());
        reservation.setStatus(request.getStatus());
        reservation.setVisitPurpose(request.getVisitPurpose());
        reservation.setDuration(request.getDuration());
        reservation.setDate(request.getDate());
        reservation.setCreatedAt(request.getCreatedAt());
        reservation.setPatientId(userId);
        reservationRepository.save(reservation);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Collections.singletonMap("message", "Reservation cancelled successfully!"));

    }

    @Override
    public ResponseEntity<?> CancelReservationRequest(ReservationRequestDTO request) {

            Reservation reservation = reservationRepository.findById(request.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));

            reservation.setStatus(request.getStatus());
            reservationRepository.save(reservation);
            updateQueueNumbersAfterCancellation(request.getDate(), request.getDoctorId(), request.getQueueNumber());

            return ResponseEntity.status(HttpStatus.ACCEPTED).body(Collections.singletonMap("message", "Reservation cancelled successfully!"));

    }



    @Override
    public List<ReservationDTO> getPatientReservations() {

        // Fetch the logged-in user ID
        Integer userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }
        List<Reservation> reservations = reservationRepository.findByPatientId(userId);
        return reservations.stream().map(reservation -> {
            ReservationDTO dto = new ReservationDTO();
            dto.setId(reservation.getId());
            dto.setQueueNumber(reservation.getQueueNumber());
            dto.setPatientId(reservation.getPatientId());
            dto.setDoctorId(reservation.getDoctorId());
            dto.setDoctor(mapToDoctorDTO(reservation.getDoctor()));
            dto.setUser(mapToUserDTO(reservation.getUser()));
            dto.setStatus(reservation.getStatus().toString());
            dto.setVisitPurpose(reservation.getVisitPurpose());
            dto.setDuration(reservation.getDuration());
            dto.setDate(reservation.getDate());
            dto.setCreatedAt(reservation.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());

        }

    private DoctorDTO mapToDoctorDTO(Doctor doctor) {
        if (doctor == null) {
            return null;
        }
        DoctorDTO dto = new DoctorDTO();
        dto.setUserId(doctor.getUserId());
        dto.setDoctorId(doctor.getUserId());
        dto.setSpecialty(doctor.getSpecialty());
        dto.setSpecialityDetails(doctor.getSpecialityDetails());
        dto.setStartTime(doctor.getStartTime());
        dto.setEndTime(doctor.getEndTime());
        dto.setWorkingDays(doctor.getWorkingDays());
        dto.setStatus(doctor.getStatus());
        dto.setFees(doctor.getFees());
        dto.setRating(doctor.getRating());
        dto.setBio(doctor.getBio());
        dto.setAddress(doctor.getUser().getAddress());
        dto.setGender(String.valueOf(doctor.getUser().getGender()));
        dto.setCity(doctor.getUser().getCity() !=null ? String.valueOf(doctor.getUser().getCity().getName()) : "No City");
        dto.setFullName(doctor.getUser().getFullName());
        dto.setUsername(doctor.getUser().getUsername());

        return dto;
    }

    private UserUpdateDTO mapToUserDTO(User user) {
        if (user == null) {
            return null;
        }
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setAge(user.getAge());
        dto.setAddress(user.getAddress());
        dto.setGender(user.getGender());
        dto.setCityId(user.getCity().getCityId());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setMedicalHistories(user.getMedicalHistory());
        dto.setAllergies(user.getAllergy());
        dto.setChronicDiseases(user.getChronicDiseases());
        dto.setDrugHistories(user.getDrugHistory());

        return dto;
    }

    @Override
    public List<ReservationDTO> getDoctorReservations() {
        // Fetch the logged-in user ID
        Integer userId = JwtUtils.getLoggedInUserId();
        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Reservation> reservations = reservationRepository.findByDoctorId(userId);
        return reservations.stream().map(reservation -> {
            ReservationDTO dto = new ReservationDTO();
            dto.setId(reservation.getId());
            dto.setQueueNumber(reservation.getQueueNumber());
            dto.setPatientId(reservation.getPatientId());
            dto.setDoctorId(reservation.getDoctorId());
            dto.setDoctor(mapToDoctorDTO(reservation.getDoctor()));
            dto.setUser(mapToUserDTO(reservation.getUser()));
            dto.setStatus(reservation.getStatus().toString());
            dto.setVisitPurpose(reservation.getVisitPurpose());
            dto.setDuration(reservation.getDuration());
            dto.setDate(reservation.getDate());
            dto.setCreatedAt(reservation.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());

    }


    @Override
    public List<Reservation> getReservationsByIdAdmin(Integer Id) {
        //TODO: Implement a method to check if the user is a doctor or patient
        return reservationRepository.findByPatientId(Id);
    }
}
