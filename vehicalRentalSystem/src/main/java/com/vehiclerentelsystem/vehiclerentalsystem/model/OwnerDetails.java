package com.vehiclerentelsystem.vehiclerentalsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "owner_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String aadhaarNumber;
    private String panNumber;

    @Lob
    @Column(name = "rc_doc", columnDefinition = "LONGBLOB")
    private byte[] rcDoc;

    @Lob
    @Column(name = "insurance_doc", columnDefinition = "LONGBLOB")
    private byte[] insuranceDoc;

    @Lob
    @Column(name = "permit_doc", columnDefinition = "LONGBLOB")
    private byte[] permitDoc;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
