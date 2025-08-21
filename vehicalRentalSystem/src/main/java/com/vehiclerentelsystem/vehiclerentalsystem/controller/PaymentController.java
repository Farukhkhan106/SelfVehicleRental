package com.vehiclerentelsystem.vehiclerentalsystem.controller;

import com.vehiclerentelsystem.vehiclerentalsystem.dto.PaymentDTO;
import com.vehiclerentelsystem.vehiclerentalsystem.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")

    public ResponseEntity<PaymentDTO> createOrder(@Valid @RequestBody PaymentDTO dto)
    {
        System.out.println("👉 Received PaymentDTO: " + dto.getBookingId() + ", " + dto.getAmount());
        try {
            PaymentDTO response = paymentService.createOrder(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDTO> getPaymentStatus(@PathVariable Long paymentId) {
        PaymentDTO dto = paymentService.getPaymentStatus(paymentId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody PaymentDTO dto) {
        // In real code, verify signature here
        paymentService.updatePaymentStatus(dto.getId(), dto.getPaymentId(), dto.getRazorpaySignature());
        return ResponseEntity.ok("Payment Verified Successfully");
    }
}
