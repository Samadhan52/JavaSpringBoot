package com.project.back_end.controllers;

import java.time.LocalDate;
import java.util.Map;

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

    public AppointmentController(AppointmentService appointmentService,
                                 CommonService commonService) {
        this.appointmentService = appointmentService;
        this.commonService = commonService;
    }

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

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> bookAppointment(
            @PathVariable String token,
            @RequestBody Appointment appointment) {

        ResponseEntity<Map<String, String>> tokenValidation =
                commonService.validateToken(token, "patient");

        if (tokenValidation != null) {
            return tokenValidation;
        }

        int validation = commonService.validateAppointment(appointment);

        if (validation == -1) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Doctor not found"));
        }

        if (validation == 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Slot not available"));
        }

        appointmentService.bookAppointment(appointment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Appointment booked"));
    }

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
