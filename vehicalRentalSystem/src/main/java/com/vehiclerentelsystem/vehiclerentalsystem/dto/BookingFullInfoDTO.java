package com.vehiclerentelsystem.vehiclerentalsystem.dto;

import com.vehiclerentelsystem.vehiclerentalsystem.model.BookingStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingFullInfoDTO {

    // Booking Info
    private Long bookingId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;

    // User Info (Renter)
    private String renterName;
    private String renterPhone;
    private String renterEmail;

    // Vehicle Info
    private String vehicleTitle;
    private String vehicleNumberPlate;
}
