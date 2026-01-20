package com.Medicare.controller;

import com.Medicare.Enums.DoctorStatus;
import com.Medicare.Enums.ERole;
import com.Medicare.Enums.ReservationStatus;
import com.Medicare.dto.*;
import com.Medicare.model.Doctor;
import com.Medicare.model.Reservation;
import com.Medicare.model.User;
import com.Medicare.repository.DoctorRepository;
import com.Medicare.repository.ReservationRepository;
import com.Medicare.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Admin management endpoints")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping("/stats")
    @Operation(
            summary = "Get admin dashboard statistics",
            description = "Returns counts for users, doctors, and reservations for the admin dashboard"
    )
    public ResponseEntity<AdminStatsDTO> getAdminStats() {
        long totalUsers = userRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalReservations = reservationRepository.count();

        long pendingDoctors = doctorRepository.countByStatus(DoctorStatus.Pending);
        long confirmedDoctors = doctorRepository.countByStatus(DoctorStatus.Confirmed);
        long rejectedDoctors = doctorRepository.countByStatus(DoctorStatus.Rejected);

        long pendingReservations = reservationRepository.countByStatus(ReservationStatus.Pending);
        long confirmedReservations = reservationRepository.countByStatus(ReservationStatus.Confirmed);
        long cancelledReservations = reservationRepository.countByStatus(ReservationStatus.Canceled);
        long completedReservations = reservationRepository.countByStatus(ReservationStatus.Completed);

        AdminStatsDTO stats = new AdminStatsDTO(
                totalUsers,
                totalDoctors,
                totalReservations,
                pendingDoctors,
                confirmedDoctors,
                rejectedDoctors,
                pendingReservations,
                confirmedReservations,
                cancelledReservations,
                completedReservations
        );

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @Operation(
            summary = "Get paginated list of users",
            description = "Returns a paginated list of users for admin management"
    )
    public ResponseEntity<PagedResponseDTO<AdminUserDTO>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "userId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Use database-level filtering for proper pagination
        Page<User> userPage;
        boolean hasSearch = search != null && !search.isEmpty();
        boolean hasRole = role != null && !role.isEmpty() && !role.equals("all");
        
        if (hasSearch && hasRole) {
            // Both search and role filter
            ERole eRole = getERole(role);
            if (eRole != null) {
                userPage = userRepository.searchUsersByRole(search, eRole, pageable);
            } else {
                userPage = userRepository.searchUsers(search, pageable);
            }
        } else if (hasSearch) {
            // Only search filter
            userPage = userRepository.searchUsers(search, pageable);
        } else if (hasRole) {
            // Only role filter
            ERole eRole = getERole(role);
            if (eRole != null) {
                userPage = userRepository.findByRole(eRole, pageable);
            } else {
                userPage = userRepository.findAll(pageable);
            }
        } else {
            // No filters
            userPage = userRepository.findAll(pageable);
        }
        
        List<AdminUserDTO> userDTOs = userPage.getContent().stream()
                .map(user -> new AdminUserDTO(
                        user.getUserId(),
                        user.getUsername(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getAge(),
                        user.getCity() != null ? user.getCity().getName().name() : null,
                        user.getRoles().stream()
                                .findFirst()
                                .map(r -> r.getName().name().replace("ROLE_", ""))
                                .orElse("PATIENT"),
                        user.getPhoneNumber(),
                        user.getGender() != null ? user.getGender().name() : null
                ))
                .collect(Collectors.toList());

        PagedResponseDTO<AdminUserDTO> response = new PagedResponseDTO(
                userDTOs,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isFirst(),
                userPage.isLast()
        );

        return ResponseEntity.ok(response);
    }
    
    private ERole getERole(String role) {
        if (role == null) return null;
        String roleLower = role.toLowerCase();
        if (roleLower.contains("admin")) return ERole.ROLE_ADMIN;
        if (roleLower.contains("doctor")) return ERole.ROLE_DOCTOR;
        if (roleLower.contains("patient")) return ERole.ROLE_PATIENT;
        return null;
    }

    @GetMapping("/doctors")
    @Operation(
            summary = "Get paginated list of doctors",
            description = "Returns a paginated list of doctors for admin management"
    )
    public ResponseEntity<PagedResponseDTO<DoctorDTO>> getDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "doctorId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String status
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Use database-level filtering for proper pagination
        Page<Doctor> doctorPage;
        if (status != null && !status.isEmpty() && !status.equals("all")) {
            // Case-insensitive enum matching
            DoctorStatus doctorStatus = null;
            for (DoctorStatus ds : DoctorStatus.values()) {
                if (ds.name().equalsIgnoreCase(status)) {
                    doctorStatus = ds;
                    break;
                }
            }
            if (doctorStatus != null) {
                doctorPage = doctorRepository.findByStatus(doctorStatus, pageable);
            } else {
                doctorPage = doctorRepository.findAll(pageable);
            }
        } else {
            doctorPage = doctorRepository.findAll(pageable);
        }
        
        List<DoctorDTO> doctorDTOs = doctorPage.getContent().stream()
                .map(doctor -> {
                    DoctorDTO dto = new DoctorDTO();
                    dto.setDoctorId(doctor.getUserId());
                    dto.setUserId(doctor.getUser() != null ? doctor.getUser().getUserId() : null);
                    dto.setFullName(doctor.getUser() != null ? doctor.getUser().getFullName() : null);
                    dto.setUsername(doctor.getUser() != null ? doctor.getUser().getUsername() : null);
                    dto.setCity(doctor.getUser() != null && doctor.getUser().getCity() != null 
                            ? doctor.getUser().getCity().getName().name() : null);
                    dto.setSpecialty(doctor.getSpecialty());
                    dto.setSpecialityDetails(doctor.getSpecialityDetails());
                    dto.setStartTime(doctor.getStartTime());
                    dto.setEndTime(doctor.getEndTime());
                    dto.setWorkingDays(doctor.getWorkingDays());
                    dto.setStatus(doctor.getStatus());
                    dto.setFees(doctor.getFees());
                    dto.setRating(doctor.getRating());
                    dto.setBio(doctor.getBio());
                    return dto;
                })
                .collect(Collectors.toList());

        PagedResponseDTO<DoctorDTO> response = new PagedResponseDTO<>(
                doctorDTOs,
                doctorPage.getNumber(),
                doctorPage.getSize(),
                doctorPage.getTotalElements(),
                doctorPage.getTotalPages(),
                doctorPage.isFirst(),
                doctorPage.isLast()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/reservations")
    @Operation(
            summary = "Get paginated list of reservations",
            description = "Returns a paginated list of reservations for admin management"
    )
    public ResponseEntity<PagedResponseDTO<AdminReservationDTO>> getReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Use database-level filtering for proper pagination
        Page<Reservation> reservationPage;
        if (status != null && !status.isEmpty() && !status.equals("all")) {
            // Case-insensitive enum matching
            ReservationStatus reservationStatus = null;
            for (ReservationStatus rs : ReservationStatus.values()) {
                if (rs.name().equalsIgnoreCase(status)) {
                    reservationStatus = rs;
                    break;
                }
            }
            if (reservationStatus != null) {
                reservationPage = reservationRepository.findByStatus(reservationStatus, pageable);
            } else {
                reservationPage = reservationRepository.findAll(pageable);
            }
        } else {
            reservationPage = reservationRepository.findAll(pageable);
        }
        
        List<AdminReservationDTO> reservationDTOs = reservationPage.getContent().stream()
                .map(reservation -> {
                    User patient = userRepository.findById(reservation.getPatientId()).orElse(null);
                    Doctor doctor = doctorRepository.findById(reservation.getDoctorId()).orElse(null);
                    
                    AdminReservationDTO dto = new AdminReservationDTO();
                    dto.setId(reservation.getId());
                    dto.setPatientName(patient != null ? patient.getFullName() : null);
                    dto.setDoctorName(doctor != null && doctor.getUser() != null ? doctor.getUser().getFullName() : null);
                    dto.setDoctorSpecialty(doctor != null ? doctor.getSpecialty() : null);
                    dto.setDate(reservation.getDate());
                    dto.setDuration(reservation.getDuration());
                    dto.setStatus(reservation.getStatus() != null ? reservation.getStatus().name() : null);
                    dto.setVisitPurpose(reservation.getVisitPurpose());
                    dto.setQueueNumber(reservation.getQueueNumber());
                    return dto;
                })
                .collect(Collectors.toList());

        PagedResponseDTO<AdminReservationDTO> response = new PagedResponseDTO(
                reservationDTOs,
                reservationPage.getNumber(),
                reservationPage.getSize(),
                reservationPage.getTotalElements(),
                reservationPage.getTotalPages(),
                reservationPage.isFirst(),
                reservationPage.isLast()
        );

        return ResponseEntity.ok(response);
    }
}
