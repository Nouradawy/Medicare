package com.Medicare.controller;

import com.Medicare.dto.ReviewsDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.Reviews;
import com.Medicare.repository.DoctorRepository;
import com.Medicare.repository.ReviewsRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
                        r.getUser().getUsername(),
                        r.getUser().getImageUrl(),
                        r.getCreatedAt()
                )) .toList();
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/addReview")
    @Operation(summary = "Add Review", description = "Add a new review.")
    public ResponseEntity<Reviews> addReview(@RequestBody Reviews review) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(review.getDoctorId());
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<Reviews> ListReviews =  reviewsRepository.findByDoctorId(review.getDoctorId());
        double ReviewsLength = ListReviews.size();
        double sumRatings = ListReviews.stream()
                .mapToDouble(Reviews::getRating)
                .sum();
        double totalRating = (sumRatings + review.getRating()) / (ReviewsLength + 1);
        Doctor existingDoctor = doctorOpt.get();
        existingDoctor.setRating(totalRating);
        doctorRepository.save(existingDoctor);
        return ResponseEntity.ok(reviewsRepository.save(review));
    }

    @PutMapping("/editReview/{id}")
    @Operation(summary = "Edit Review", description = "Edit an existing review.")
    public ResponseEntity<Reviews> editReview(@PathVariable Integer id, @RequestBody Reviews review) {
        Optional<Reviews> existing = reviewsRepository.findById(id);
        if (existing.isPresent()) {
            Reviews r = existing.get();
            r.setRating(review.getRating());
            r.setComment(review.getComment());
            // update other fields as needed
            return ResponseEntity.ok(reviewsRepository.save(r));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}