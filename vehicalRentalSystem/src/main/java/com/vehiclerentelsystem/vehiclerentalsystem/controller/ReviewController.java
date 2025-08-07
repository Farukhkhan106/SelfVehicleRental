package com.vehicalrentelsystem.vehicalrentalsystem.controller;

import com.vehicalrentelsystem.vehicalrentalsystem.dto.ReviewDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.service.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Add a new review
    @PostMapping("/add")
    public ResponseEntity<String> addReview(@RequestBody ReviewDTO reviewDTO) {
        try {
            reviewService.addReview(reviewDTO);
            return ResponseEntity.ok("Review added successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all reviews for a vehicle
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<?> getVehicleReviews(@PathVariable Long vehicleId) {
        try {
            List<ReviewDTO> reviews = reviewService.getReviewsByVehicle(vehicleId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Get all reviews by a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserReviews(@PathVariable Long userId) {
        try {
            List<ReviewDTO> reviews = reviewService.getReviewsByUser(userId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Get average rating of a vehicle
    @GetMapping("/vehicle/{vehicleId}/average-rating")
    public ResponseEntity<?> getAverageRating(@PathVariable Long vehicleId) {
        try {
            Double avgRating = reviewService.getAverageRating(vehicleId);
            return ResponseEntity.ok(avgRating != null ? avgRating : 0.0);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Optional: Delete a review by id (only admin or review owner)
    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok("Review deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
