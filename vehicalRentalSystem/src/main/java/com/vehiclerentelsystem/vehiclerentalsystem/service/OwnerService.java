package com.vehiclerentelsystem.vehiclerentalsystem.service;

import com.vehiclerentelsystem.vehiclerentalsystem.model.OwnerDetails;
import com.vehiclerentelsystem.vehiclerentalsystem.model.Role;
import com.vehiclerentelsystem.vehiclerentalsystem.model.User;
import com.vehiclerentelsystem.vehiclerentalsystem.repository.OwnerDetailsRepository;
import com.vehiclerentelsystem.vehiclerentalsystem.repository.UserRepository;
import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class OwnerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OwnerDetailsRepository ownerDetailsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getOwnerByEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent() && optionalUser.get().getRole() == Role.OWNER) {
            return optionalUser.get();
        }
        return null;
    }

    public void saveOwner(User user) {
        userRepository.save(user);
    }

    public void saveOwnerWithPassword(User user, String rawPassword, BCryptPasswordEncoder encoder) {
        user.setPassword(encoder.encode(rawPassword));
        userRepository.save(user);
    }

    public OwnerDetails getOwnerDetailsByUser(User user) {
        return ownerDetailsRepository.findByUserId(user.getId());
    }

    public void saveOwnerDetails(OwnerDetails details) {
        ownerDetailsRepository.save(details);
    }

    public Map<String, Object> getOwnerProfile(Long userId) {
        User user = userRepository.findById(userId)
                .filter(u -> u.getRole() == Role.OWNER)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // ✅ Now use userId directly
        OwnerDetails ownerDetails = ownerDetailsRepository.findByUserId(userId);

        Map<String, Object> response = new HashMap<>();

        // User Info
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("phone", user.getPhone());
        userInfo.put("address", user.getAddress());
        userInfo.put("city", user.getCity());
        userInfo.put("state", user.getState());
        userInfo.put("pincode", user.getPincode());
        userInfo.put("about", user.getAbout());

        // OwnerDetails Info
        Map<String, Object> ownerData = new HashMap<>();
        if (ownerDetails != null) {
            ownerData.put("bankName", ownerDetails.getBankName());
            ownerData.put("accountNumber", ownerDetails.getAccountNumber());
            ownerData.put("ifscCode", ownerDetails.getIfscCode());
            ownerData.put("aadhaarNumber", ownerDetails.getAadhaarNumber());
            ownerData.put("panNumber", ownerDetails.getPanNumber());
        }

        // Dummy earnings
        Map<String, Object> earnings = new HashMap<>();
        earnings.put("totalMonthly", 50000);
        earnings.put("totalYearly", 600000);
        earnings.put("lifetime", 1200000);
        earnings.put("pendingPayout", 35000);

        List<Map<String, Object>> perVehicle = new ArrayList<>();
        perVehicle.add(Map.of("vehicle", "Honda City", "earnings", 200000));
        perVehicle.add(Map.of("vehicle", "Suzuki Swift", "earnings", 150000));
        perVehicle.add(Map.of("vehicle", "Hyundai Creta", "earnings", 250000));
        earnings.put("perVehicle", perVehicle);

        response.put("ownerInfo", userInfo);
        response.put("ownerExtra", ownerData);
        response.put("earnings", earnings);

        return response;
    }
    public void uploadDocuments(User user, MultipartFile rc, MultipartFile insurance, MultipartFile permit) throws IOException, java.io.IOException {
        OwnerDetails details = getOwnerDetailsByUser(user);
        if (details == null) {
            details = new OwnerDetails();
            details.setUser(user);
        }

        if (rc != null) details.setRcDoc(rc.getBytes());
        if (insurance != null) details.setInsuranceDoc(insurance.getBytes());
        if (permit != null) details.setPermitDoc(permit.getBytes());

        saveOwnerDetails(details);
    }


}
