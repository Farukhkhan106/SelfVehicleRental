package com.token.restapi.controller;

import com.token.restapi.model.Student;
import com.token.restapi.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("student")
public class StudentController {

    @Autowired
     private  StudentService studentService;


    @PostMapping
    public Boolean addStudent(@RequestBody Student student) {
       return  studentService.addStudent(student);
    }
    @GetMapping
    public List<Student> getAllStudents() {
       return  studentService.getAllStudent();
    }
    @PutMapping("{id}")
    public boolean UpdateStudent(@RequestBody Student student, @PathVariable String id) {
        return studentService.update(student,id);
    }
}
