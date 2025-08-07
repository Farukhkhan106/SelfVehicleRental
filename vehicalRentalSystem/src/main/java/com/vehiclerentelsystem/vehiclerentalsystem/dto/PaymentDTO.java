package com.vehicalrentelsystem.vehicalrentalsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;

    @NotNull(message = "Booking ID cannot be null")
    private Long bookingId;

    @NotNull(message = "Amount cannot be null")
    private Double amount;

    @NotNull(message = "Owner ID cannot be null")
    private Long ownerId; // 👈 Add this

    @NotNull(message = "Vehicle ID cannot be null")
    private Long vehicleId; // 👈 Add this

    private String status;
    private String orderId;
    private String paymentId;
    private String razorpaySignature;
}
