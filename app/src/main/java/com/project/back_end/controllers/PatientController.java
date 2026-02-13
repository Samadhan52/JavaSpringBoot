package com.project.back_end.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Patient;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.CommonService;

@RestController
@RequestMapping("/patient")
public class PatientController {

    private final PatientService patientService;
    private final CommonService commonService;

    public PatientController(PatientService patientService,
                             CommonService commonService) {
        this.patientService = patientService;
        this.commonService = commonService;
    }

    /**
     * 1️⃣ Get Patient Details
     */
    @GetMapping("/{token}")
    public ResponseEntity<?> getPatient(@PathVariable String token) {

        ResponseEntity<Map<String, String>> tokenValidation =
                commonService.validateToken(token, "patient");

        if (!tokenValidation.getStatusCode().is2xxSuccessful()) {
            return tokenValidation;
        }

        // ✅ return service response directly
        return patientService.getPatientDetails(token);
    }

    /**
     * 2️⃣ Create New Patient (Signup)
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> createPatient(
            @RequestBody Patient patient) {

        int result = patientService.createPatient(patient);

        if (result == 1) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Signup successful"));
        }

        if (result == -1) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                        "error",
                        "Patient with email id or phone no already exist"
                    ));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error"));
    }

    /**
     * 3️⃣ Patient Login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody Login login) {

        return commonService.validatePatientLogin(login);
    }

    /**
     * 4️⃣ Get Patient Appointments
     */
    @GetMapping("/{id}/{token}")
    public ResponseEntity<?> getPatientAppointment(
            @PathVariable Long id,
            @PathVariable String token) {

        ResponseEntity<Map<String, String>> tokenValidation =
                commonService.validateToken(token, "patient");

        if (!tokenValidation.getStatusCode().is2xxSuccessful()) {
            return tokenValidation;
        }

        // ✅ pass token + id
        return patientService.getPatientAppointment(id, token);
    }

    /**
     * 5️⃣ Filter Patient Appointments
     */
    @GetMapping("/filter/{condition}/{name}/{token}")
    public ResponseEntity<?> filterPatientAppointment(
            @PathVariable String condition,
            @PathVariable String name,
            @PathVariable String token) {

        ResponseEntity<Map<String, String>> tokenValidation =
                commonService.validateToken(token, "patient");

        if (!tokenValidation.getStatusCode().is2xxSuccessful()) {
            return tokenValidation;
        }

        return commonService.filterPatient(condition, name, token);
    }
}
