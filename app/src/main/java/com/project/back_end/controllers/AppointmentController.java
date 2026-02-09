package com.project.back_end.controllers;

import java.util.Map;
import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.CommonService;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final CommonService commonService;

    // Constructor injection
    public AppointmentController(AppointmentService appointmentService,
                                 CommonService commonService) {
        this.appointmentService = appointmentService;
        this.commonService = commonService;
    }

    /**
     * Get appointments for a patient on a given date (Doctor only)
     */
    @GetMapping("/{date}/{patientName}/{token}")
    public ResponseEntity<?> getAppointments(
            @PathVariable String date,
            @PathVariable String patientName,
            @PathVariable String token) {

        ResponseEntity<Map<String, String>> tokenValidation =
                commonService.validateToken(token, "doctor");

        if (tokenValidation != null) {
            return tokenValidation;
        }

        return appointmentService.getAppointment(
        patientName,
        LocalDate.parse(date),
        token
);

    }

    /**
     * Book a new appointment (Patient only)
     */
    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> bookAppointment(
            @PathVariable String token,
            @RequestBody Appointment appointment) {

        ResponseEntity<Map<String, String>> tokenValidation =
                commonService.validateToken(token, "patient");

        if (tokenValidation != null) {
            return tokenValidation;
        }

        int validationResult = commonService.validateAppointment(appointment);

        if (validationResult == -1) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Doctor not found"));
        }

        if (validationResult == 0) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Appointment slot not available"));
        }

        int result = appointmentService.bookAppointment(appointment);

        if (result == 1) {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of("message", "Appointment booked successfully"));
        }

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to book appointment"));
    }

    /**
     * Update an existing appointment (Patient only)
     */
    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateAppointment(
            @PathVariable String token,
            @RequestBody Appointment appointment) {

        ResponseEntity<Map<String, String>> tokenValidation =
                commonService.validateToken(token, "patient");

        if (tokenValidation != null) {
            return tokenValidation;
        }

        return appointmentService.updateAppointment(appointment);
    }

    /**
     * Cancel an appointment (Patient only)
     */
    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> cancelAppointment(
            @PathVariable long id,
            @PathVariable String token) {

        ResponseEntity<Map<String, String>> tokenValidation =
                commonService.validateToken(token, "patient");

        if (tokenValidation != null) {
            return tokenValidation;
        }

        return appointmentService.cancelAppointment(id, token);

    }
}
