package com.vehiclerentelsystem.vehiclerentalsystem.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingAfterPaymentDTO {
    private Long userId;
    private Long vehicleId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double amount;

    // Razorpay payment details
    private String orderId;
    private String paymentId;
    private String signature;

    // ✅ Add this field to match what's used in service
    private Long paymentIdInDb;
}
