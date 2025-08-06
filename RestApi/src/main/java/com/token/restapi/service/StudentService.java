package com.token.restapi.service;

import com.token.restapi.model.Student;
import com.token.restapi.repo.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepo studentRepo;

    // Add a student
    public Boolean addStudent(Student student) {
        studentRepo.save(student);
        return true;
    }

    // Get all students
    public List<Student> getAllStudent() {
        return studentRepo.findAll();
    }

    // Update a student
    public boolean update(Student student, String id) {
        Optional<Student> optionalStudent = studentRepo.findById(id);
        if (optionalStudent.isEmpty()) {
            return false;
        }

        Student existingStudent = optionalStudent.get();

        // Update only mutable fields — don't change rollNo (ID)
        existingStudent.setName(student.getName());
        existingStudent.setAge(student.getAge());
        existingStudent.setClasss(student.getClasss());

        studentRepo.save(existingStudent);
        return true;
    }
}
