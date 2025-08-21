package com.vehiclerentelsystem.vehiclerentalsystem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    @JsonBackReference("vehicle-bookings")
    private Vehicle vehicle;

    private LocalDate startDate;
    private LocalDate endDate;

    private Long ownerId;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private Double totalAmount;
}
