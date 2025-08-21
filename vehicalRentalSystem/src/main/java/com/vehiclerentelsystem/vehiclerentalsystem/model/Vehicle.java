package com.vehiclerentelsystem.vehiclerentalsystem.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ownerId;
    private String brand;
    private String model;
    private String title;
    private String description;
    private String location;
    private Integer year;
    private String type;
    private Integer seats;
    private String transmission;
    private String fuelType;

    @ElementCollection
    private List<String> features;

    private String numberPlate;
    private BigDecimal pricePerDay;
    private String ownerPhone;
    private String ownerCity;
    private String ownerAddress;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;
    private boolean available = true;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String photosJson;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference("vehicle-bookings")
    private List<Booking> bookings;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference("vehicle-reviews")
    private List<Review> reviews;
}
