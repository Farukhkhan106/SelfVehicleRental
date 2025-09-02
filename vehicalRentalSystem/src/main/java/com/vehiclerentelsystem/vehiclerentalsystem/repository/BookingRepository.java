package com.vehiclerentelsystem.vehiclerentalsystem.repository;

import com.vehiclerentelsystem.vehiclerentalsystem.model.Booking;
import com.vehiclerentelsystem.vehiclerentalsystem.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.vehicle.id = :vehicleId AND b.status = :status " +
            "AND b.startDate <= :endDate AND b.endDate >= :startDate")
    List<Booking> findOverlappingBookings(
            @Param("vehicleId") Long vehicleId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") BookingStatus status
    );

    @Query("SELECT b FROM Booking b WHERE b.vehicle.id = :vehicleId " +
            "AND :startDate <= b.endDate AND :endDate >= b.startDate " +
            "AND b.status = 'CONFIRMED'")
    Optional<Booking> findFirstByVehicleIdAndDateRangeOverlap(
            @Param("vehicleId") Long vehicleId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT b FROM Booking b WHERE b.ownerId = :ownerId AND b.status = :status")
    List<Booking> findByOwnerAndStatus(@Param("ownerId") Long ownerId, @Param("status") BookingStatus status);

    /**
     * ✅ Update expired CONFIRMED bookings to COMPLETED
     */
    @Modifying
    @Transactional
    @Query("UPDATE Booking b SET b.status = 'COMPLETED' WHERE b.endDate < :today AND b.status = 'CONFIRMED'")
    void markExpiredBookingsAsCompleted(@Param("today") LocalDate today);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b")
    Double getTotalRevenue();
}
