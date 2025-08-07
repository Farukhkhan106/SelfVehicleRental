package com.vehiclerentelsystem.vehiclerentalsystem.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.vehiclerentelsystem.vehiclerentalsystem.dto.PaymentDTO;
import com.vehiclerentelsystem.vehiclerentalsystem.model.Payment;
import com.vehiclerentelsystem.vehiclerentalsystem.model.PaymentStatus;
import com.vehiclerentelsystem.vehiclerentalsystem.repository.PaymentRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

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
        payment.setOwnerId(dto.getOwnerId());
        payment.setVehicleId(dto.getVehicleId());

        paymentRepository.save(payment);

        dto.setId(payment.getId());
        return dto;
    }

    public PaymentDTO getPaymentStatus(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setBookingId(payment.getBookingId());
        dto.setAmount(payment.getAmount());
        dto.setStatus(payment.getStatus().name());
        dto.setPaymentId(payment.getPaymentId());
        dto.setOrderId(null); // if needed
        dto.setRazorpaySignature(null); // if needed
        dto.setOwnerId(payment.getOwnerId());
        dto.setVehicleId(payment.getVehicleId());

        return dto;
    }

    public void updatePaymentStatus(Long paymentId, String razorpayPaymentId, String signature) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentId(razorpayPaymentId);
        // Optionally save signature somewhere
        paymentRepository.save(payment);
    }
    public boolean verifySignature(String orderId, String paymentId, String razorpaySignature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(razorpaySecret.getBytes(), "HmacSHA256"));
            byte[] digest = mac.doFinal(payload.getBytes());

            String generatedSignature = bytesToHex(digest);  // Hex instead of Base64
            return generatedSignature.equals(razorpaySignature);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b)); // lower-case hex
        }
        return sb.toString();
    }

}
