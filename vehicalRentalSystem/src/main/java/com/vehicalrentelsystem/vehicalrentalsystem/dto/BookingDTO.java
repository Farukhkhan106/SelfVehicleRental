package com.vehicalrentelsystem.vehicalrentalsystem.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private Long userId;
    private Long vehicleId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    // ✅ Add this
    private Double totalAmount;
}
