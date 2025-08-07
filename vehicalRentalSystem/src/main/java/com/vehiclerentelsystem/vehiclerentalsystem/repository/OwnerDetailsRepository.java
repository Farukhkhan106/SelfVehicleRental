package com.vehiclerentelsystem.vehiclerentalsystem.repository;

import com.vehiclerentelsystem.vehiclerentalsystem.model.OwnerDetails;
import com.vehiclerentelsystem.vehiclerentalsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OwnerDetailsRepository extends JpaRepository<OwnerDetails, Long> {
    OwnerDetails findByUserId(Long userId);
}
