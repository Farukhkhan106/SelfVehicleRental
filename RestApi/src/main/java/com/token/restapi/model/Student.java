package com.token.restapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Student")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Student {
    @Id
    private String rollNo;
    private String name;
    private int age;
    private int classs;
}
