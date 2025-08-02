package com.vehicalrentelsystem.vehicalrentalsystem.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.vehicalrentelsystem.vehicalrentalsystem.dto.PaymentDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.model.Payment;
import com.vehicalrentelsystem.vehicalrentalsystem.model.PaymentStatus;
import com.vehicalrentelsystem.vehicalrentalsystem.repository.PaymentRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public PaymentDTO createOrder(PaymentDTO dto) throws Exception {
        RazorpayClient client = new RazorpayClient(razorpayKey, razorpaySecret);

        int amountInPaise = (int) (dto.getAmount() * 100);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt_booking_" + dto.getBookingId());

        Order order = client.orders.create(orderRequest);

        dto.setOrderId(order.get("id"));
        dto.setStatus(PaymentStatus.PENDING.name());

        Payment payment = new Payment();
        payment.setAmount(dto.getAmount());
        payment.setBookingId(dto.getBookingId());
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);

        dto.setId(payment.getId());
        return dto;
    }

    public PaymentDTO getPaymentStatus(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return new PaymentDTO(
                payment.getId(),
                payment.getBookingId(),
                payment.getAmount(),
                payment.getStatus().name(),
                null,
                null,
                null
        );
    }

    public void updatePaymentStatus(Long paymentId, String razorpayPaymentId, String signature) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);
    }
}
