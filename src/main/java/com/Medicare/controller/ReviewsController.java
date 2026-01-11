package com.Medicare.controller;

import com.Medicare.dto.ReviewsDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.Reviews;
import com.Medicare.repository.DoctorRepository;
import com.Medicare.repository.ReviewsRepository;
import com.Medicare.security.jwt.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Reviews")
public class ReviewsController {

    @Autowired
    private ReviewsRepository reviewsRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping("/getAllReviews")
    @Operation(summary = "Get All Reviews", description = "Retrieve all reviews.")
    public ResponseEntity<List<Reviews>> getAllReviews() {
        return ResponseEntity.ok(reviewsRepository.findAll());
    }

    @GetMapping("/reviews/me")
    @Operation(summary = "Get Reviews for Logged-in User", description = "Retrieve reviews by authenticated user's ID.")
    public ResponseEntity<List<ReviewsDTO>> getMyReviews(Authentication authentication) {
        // Assuming principal holds userId as Integer or can derive it from a custom UserDetails
        Integer userId;
        userId = JwtUtils.getLoggedInUserId();
        List<Reviews> reviewsList = reviewsRepository.findByPatientId(userId);
        List<ReviewsDTO> dtoList = reviewsList.stream()
                .map(r -> new ReviewsDTO(
                        r.getDoctorId(),
                        r.getPatientId(),
                        r.getRating(),
                        r.getComment(),
                        r.getDoc_comment(),
                        r.getReservationId(),
                        r.getUser().getUsername(),
                        r.getUser().getImageUrl(),
                        r.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/getReviewsByDoctor/{doctorId}")
    @Operation(summary = "Get Reviews by Doctor", description = "Retrieve reviews by doctorId.")
    public ResponseEntity<List<ReviewsDTO>> getReviewsByDoctor(@PathVariable Integer doctorId) {
        List<Reviews> reviewsList = reviewsRepository.findByDoctorId(doctorId);
        List<ReviewsDTO> dtoList = reviewsList.stream()
                .map(r -> new ReviewsDTO(
                        r.getDoctorId(),
                        r.getPatientId(),
                        r.getRating(),
                        r.getComment(),
                        r.getDoc_comment(),
                        r.getReservationId(),
                        r.getUser().getUsername(),
                        r.getUser().getImageUrl(),
                        r.getCreatedAt()
                )) .toList();
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/addReview")
    @Operation(summary = "Add Review / Edit", description = "Add a new review.")
    public ResponseEntity<Reviews> addReview(@RequestBody Reviews review) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(review.getDoctorId());
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Reviews> existingOpt = reviewsRepository.findByReservationId(review.getReservationId());
        Reviews toSave;
        if (existingOpt.isPresent()) {
            Reviews existing = existingOpt.get();
            existing.setRating(review.getRating());
            existing.setComment(review.getComment());
            existing.setPatientId(review.getPatientId());
            existing.setDoctorId(review.getDoctorId());
            // set other fields as needed (e.g., updatedAt)
            toSave = existing;
        } else {
            toSave = review;
        }
        Reviews saved = reviewsRepository.save(toSave);

        List<Reviews> doctorReviews = reviewsRepository.findByDoctorId(saved.getDoctorId());
        double average = doctorReviews.stream()
                .mapToDouble(Reviews::getRating)
                .average()
                .orElse(0.0);

        Doctor doctor = doctorOpt.get();
        doctor.setRating(average);
        doctorRepository.save(doctor);

        return ResponseEntity.ok(saved);
    }

}