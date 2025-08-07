package com.vehiclerentelsystem.vehiclerentalsystem.repository;

import com.vehiclerentelsystem.vehiclerentalsystem.model.Booking;
import com.vehiclerentelsystem.vehiclerentalsystem.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {


    /**
     * Get all bookings by user ID.
     */
    List<Booking> findByUserId(Long userId);

    /**
     * Find bookings that overlap with a given date range for a vehicle and specific status.
     */
    @Query("SELECT b FROM Booking b WHERE b.vehicle.id = :vehicleId AND b.status = :status " +
            "AND b.startDate <= :endDate AND b.endDate >= :startDate")
    List<Booking> findOverlappingBookings(
            @Param("vehicleId") Long vehicleId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") BookingStatus status
    );

    /**
     * Find first overlapping confirmed booking for a vehicle.
     */
    @Query("SELECT b FROM Booking b WHERE b.vehicle.id = :vehicleId " +
            "AND :startDate <= b.endDate AND :endDate >= b.startDate " +
            "AND b.status = 'CONFIRMED'")
    Optional<Booking> findFirstByVehicleIdAndDateRangeOverlap(
            @Param("vehicleId") Long vehicleId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Get all bookings for vehicles owned by a specific owner and with a specific status.
     */
    @Query("SELECT b FROM Booking b WHERE b.vehicle.ownerId = :ownerId AND b.status = :status")
    List<Booking> findByOwnerAndStatus(
            @Param("ownerId") Long ownerId,
            @Param("status") BookingStatus status
    );


}
