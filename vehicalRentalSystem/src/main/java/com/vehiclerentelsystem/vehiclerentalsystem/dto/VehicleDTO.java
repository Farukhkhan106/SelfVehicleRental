package com.vehiclerentelsystem.vehiclerentalsystem.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleDTO {
    private Long id;
    private Long ownerId;
    private String brand;
    private String model;
    private String title; // Ensure title is present
    private String description; // Ensure description is present
//    private String location;

    private Integer year;
    private String type;
    private Integer seats;
    private String transmission;
    private String fuelType;

    private List<String> features;

    private String registrationNumber; // Use registrationNumber for consistency

    private BigDecimal pricePerDay;
    private String status;
    private List<String> photoUrls;

    private String ownerPhone;
    private String ownerCity;
    private String ownerAddress;
}
