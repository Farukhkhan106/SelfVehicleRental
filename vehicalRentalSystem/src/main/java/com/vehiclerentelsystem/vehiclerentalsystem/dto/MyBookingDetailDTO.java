package com.vehiclerentelsystem.vehiclerentalsystem.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MyBookingDetailDTO {
    private Long bookingId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    // Vehicle Info
    private Long vehicleId;
    private String brand;
    private String model;
    private String number;
    private String image; // Single (first) image
    private List<String> images; // ✅ List of all vehicle images
    private double pricePerDay;

    // Owner Info
    private String ownerName;
    private String ownerCity;
    private String ownerPhone;

    // Additional info
    private Double totalAmount;
}
