package com.project.back_end.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models .Patient;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private TokenService tokenService;

    /* ============================================================
       1. BOOK APPOINTMENT
       ============================================================ */

    @Transactional
    public int bookAppointment(Appointment appointment) {
        try {
            appointmentRepository.save(appointment);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /* ============================================================
       2. UPDATE APPOINTMENT
       ============================================================ */

    @Transactional
    public ResponseEntity<Map<String, String>> updateAppointment(Appointment appointment) {

        Map<String, String> response = new HashMap<>();

        Optional<Appointment> existingOpt =
                appointmentRepository.findById(appointment.getId());

        if (existingOpt.isEmpty()) {
            response.put("message", "Appointment not found.");
            return ResponseEntity.badRequest().body(response);
        }

        Appointment existing = existingOpt.get();

        // Basic validation example
        existing.setAppointmentTime(appointment.getAppointmentTime());
        existing.setStatus(appointment.getStatus());

        appointmentRepository.save(existing);

        response.put("message", "Appointment updated successfully.");
        return ResponseEntity.ok(response);
    }

    /* ============================================================
       3. CANCEL APPOINTMENT
       ============================================================ */

    @Transactional
    public ResponseEntity<Map<String, String>> cancelAppointment(long id, String token) {

        Map<String, String> response = new HashMap<>();

        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);

        if (appointmentOpt.isEmpty()) {
            response.put("message", "Appointment not found.");
            return ResponseEntity.badRequest().body(response);
        }

        Appointment appointment = appointmentOpt.get();

        // Validate token (ensure correct patient)
        if (!tokenService.validateToken(token, "patient")) {
    response.put("message", "Unauthorized");
    return ResponseEntity.status(403).body(response);
}


        appointmentRepository.delete(appointment);

        response.put("message", "Appointment cancelled successfully.");
        return ResponseEntity.ok(response);
    }

    /* ============================================================
       4. GET APPOINTMENTS FOR DOCTOR BY DATE
       ============================================================ */

    public Map<String, Object> getAppointment(String pname,
                                          LocalDate date,
                                          String token) {

    Map<String, Object> result = new HashMap<>();

    // ✅ Validate doctor token (boolean)
    if (!tokenService.validateToken(token, "doctor")) {
        result.put("appointments", Collections.emptyList());
        return result;
    }

    LocalDateTime start = date.atStartOfDay();
    LocalDateTime end = date.atTime(23, 59, 59);

    List<Appointment> appointments;

    if (pname != null && !pname.equalsIgnoreCase("null")) {
        appointments =
                appointmentRepository
                        .findByPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
                                pname, start, end);
    } else {
        appointments =
                appointmentRepository
                        .findByAppointmentTimeBetween(start, end);
    }

    result.put("appointments", appointments);
    return result;
}
