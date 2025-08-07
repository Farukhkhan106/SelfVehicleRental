package com.vehicalrentelsystem.vehicalrentalsystem.controller;

import com.vehicalrentelsystem.vehicalrentalsystem.dto.BookingAfterPaymentDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.dto.BookingDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.dto.MyBookingDetailDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.model.Booking;
import com.vehicalrentelsystem.vehicalrentalsystem.service.BookingService;
import com.vehicalrentelsystem.vehicalrentalsystem.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

import static com.razorpay.Utils.verifySignature;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO bookingDTO, Authentication authentication) {
        try {
            Booking createdBooking = bookingService.createBooking(bookingDTO, authentication);
            return ResponseEntity.ok(Map.of(
                    "message", "Booking created successfully!",
                    "id", createdBooking.getId()
            ));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/create-after-payment")
    public ResponseEntity<?> createBookingAfterPayment(@RequestBody BookingAfterPaymentDTO dto) {
        // 1. Verify Razorpay Signature
        boolean isValid = paymentService.verifySignature(dto.getOrderId(), dto.getPaymentId(), dto.getSignature());

        if (!isValid) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid Razorpay signature."));
        }

        try {
            BookingDTO booking = bookingService.createBookingAfterPayment(dto);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("message", "Booking failed after payment."));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<Map<String, String>> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully!"));
    }

    @DeleteMapping("/delete/{bookingId}")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable Long bookingId) {
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.ok(Map.of("message", "Booking deleted successfully!"));
    }

    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(
            @RequestParam Long vehicleId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "available", false,
                    "message", "Invalid date range"
            ));
        }

        Optional<Booking> overlapping = bookingService.findOverlappingBooking(vehicleId, startDate, endDate);
        if (overlapping.isPresent()) {
            Booking b = overlapping.get();
            return ResponseEntity.ok(Map.of(
                    "available", false,
                    "message", "Vehicle is not available during selected dates.",
                    "unavailableFrom", b.getStartDate(),
                    "unavailableTo", b.getEndDate()
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                    "available", true,
                    "message", "Vehicle is available."
            ));
        }
    }

    @GetMapping("/my-detailed-bookings-by-user/{userId}")
    public ResponseEntity<List<MyBookingDetailDTO>> getMyDetailedBookingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getMyDetailedBookingsByUserId(userId));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<MyBookingDetailDTO>> getBookingsByOwnerAndStatus(
            @PathVariable Long ownerId,
            @RequestParam String status) {
        return ResponseEntity.ok(bookingService.getBookingsByOwnerAndStatus(ownerId, status));
    }
}
