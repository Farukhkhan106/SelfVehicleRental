package com.vehiclerentelsystem.vehiclerentalsystem.repository;

import com.vehiclerentelsystem.vehiclerentalsystem.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByBookingId(Long bookingId);
}
