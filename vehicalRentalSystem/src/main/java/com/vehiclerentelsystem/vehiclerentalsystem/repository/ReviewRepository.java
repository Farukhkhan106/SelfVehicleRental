package com.vehiclerentelsystem.vehiclerentalsystem.repository;

import com.vehiclerentelsystem.vehiclerentalsystem.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Get all reviews for a vehicle
    List<Review> findByVehicleId(Long vehicleId);

    // Get all reviews by a user
    List<Review> findByUserId(Long userId);

    // Check if a user already reviewed a vehicle
    boolean existsByUserIdAndVehicleId(Long userId, Long vehicleId);

    // Get average rating for a vehicle
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.vehicle.id = :vehicleId")
    Double findAverageRatingByVehicleId(@Param("vehicleId") Long vehicleId);

    // Optional: Get limited recent reviews for a vehicle (e.g., last 5)
    List<Review> findTop5ByVehicleIdOrderByIdDesc(Long vehicleId);
}
