package com.vehiclerentelsystem.vehiclerentalsystem.dto;

import lombok.Data;

@Data
public class OwnerDTO {
    // 🔹 User table fields
    private String name;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String about;

    // 🔹 OwnerDetails table fields
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String aadhaarNumber;
    private String panNumber;
}
