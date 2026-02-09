package com.project.back_end.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private TokenService tokenService;

    /* ============================================================
       1. GET DOCTOR AVAILABILITY
       ============================================================ */

    @Transactional
    public List<String> getDoctorAvailability(Long doctorId, LocalDate date) {

        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        if (doctor == null) return Collections.emptyList();

        List<String> availableSlots = new ArrayList<>(doctor.getAvailableTimes());

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59);

        List<Appointment> appointments =
                appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                        doctorId, start, end);

        for (Appointment appointment : appointments) {
            availableSlots.remove(appointment.getAppointmentTime().toLocalTime().toString());
        }

        return availableSlots;
    }

    /* ============================================================
       2. SAVE DOCTOR
       ============================================================ */

    public int saveDoctor(Doctor doctor) {
        try {
            if (doctorRepository.findByEmail(doctor.getEmail()) != null) {
                return -1;
            }
            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /* ============================================================
       3. UPDATE DOCTOR
       ============================================================ */

    public int updateDoctor(Doctor doctor) {
        try {
            if (!doctorRepository.existsById(doctor.getId())) {
                return -1;
            }
            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /* ============================================================
       4. GET ALL DOCTORS
       ============================================================ */

    @Transactional
    public List<Doctor> getDoctors() {
        return doctorRepository.findAll();
    }

    /* ============================================================
       5. DELETE DOCTOR
       ============================================================ */

    public int deleteDoctor(long id) {
        try {
            Doctor doctor = doctorRepository.findById(id).orElse(null);
            if (doctor == null) return -1;

            appointmentRepository.deleteAllByDoctorId(id);
            doctorRepository.deleteById(id);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /* ============================================================
       6. VALIDATE DOCTOR LOGIN
       ============================================================ */

    public ResponseEntity<Map<String, String>> validateDoctor(Login login) {

        Map<String, String> response = new HashMap<>();

        Doctor doctor = doctorRepository.findByEmail(login.getIdentifier());
        if (doctor == null) {
            response.put("message", "Doctor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (!doctor.getPassword().equals(login.getPassword())) {
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String token = tokenService.generateToken(doctor.getEmail(),"doctor");
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    /* ============================================================
       7. FIND DOCTOR BY NAME
       ============================================================ */

    @Transactional
    public Map<String, Object> findDoctorByName(String name) {

        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorRepository.findByNameLike(name));
        return response;
    }

    /* ============================================================
       8. FILTER BY NAME + SPECIALTY + TIME
       ============================================================ */

    @Transactional
    public Map<String, Object> filterDoctorsByNameSpecilityandTime(
            String name, String specialty, String amOrPm) {

        List<Doctor> doctors =
                doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);

        doctors = filterDoctorByTime(doctors, amOrPm);

        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctors);
        return response;
    }

    /* ============================================================
       9. FILTER BY NAME + TIME
       ============================================================ */

    @Transactional
    public Map<String, Object> filterDoctorByNameAndTime(String name, String amOrPm) {

        List<Doctor> doctors = doctorRepository.findByNameLike(name);
        doctors = filterDoctorByTime(doctors, amOrPm);

        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctors);
        return response;
    }

    /* ============================================================
       10. FILTER BY NAME + SPECIALTY
       ============================================================ */

    @Transactional
    public Map<String, Object> filterDoctorByNameAndSpecility(String name, String specialty) {

        Map<String, Object> response = new HashMap<>();
        response.put(
                "doctors",
                doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty)
        );
        return response;
    }

    /* ============================================================
       11. FILTER BY SPECIALTY + TIME
       ============================================================ */

    @Transactional
    public Map<String, Object> filterDoctorByTimeAndSpecility(String specialty, String amOrPm) {

        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        doctors = filterDoctorByTime(doctors, amOrPm);

        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctors);
        return response;
    }

    /* ============================================================
       12. FILTER BY SPECIALTY
       ============================================================ */

    @Transactional
    public Map<String, Object> filterDoctorBySpecility(String specialty) {

        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorRepository.findBySpecialtyIgnoreCase(specialty));
        return response;
    }

    /* ============================================================
       13. FILTER ALL DOCTORS BY TIME
       ============================================================ */

    @Transactional
    public Map<String, Object> filterDoctorsByTime(String amOrPm) {

        List<Doctor> doctors = doctorRepository.findAll();
        doctors = filterDoctorByTime(doctors, amOrPm);

        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctors);
        return response;
    }

    /* ============================================================
       14. PRIVATE TIME FILTER HELPER
       ============================================================ */

    private List<Doctor> filterDoctorByTime(List<Doctor> doctors, String amOrPm) {

        return doctors.stream()
                .filter(doctor ->
                        doctor.getAvailableTimes().stream().anyMatch(time -> {
                            int hour = Integer.parseInt(time.split(":")[0]);
                            return "AM".equalsIgnoreCase(amOrPm) ? hour < 12 : hour >= 12;
                        })
                )
                .collect(Collectors.toList());
    }
}
