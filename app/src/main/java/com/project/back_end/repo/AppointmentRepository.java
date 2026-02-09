package com.project.back_end.repo;

import com.project.back_end.models.Appointment;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // 1️⃣ Get appointments for a doctor within a time range
    @Query("""
        SELECT DISTINCT a FROM Appointment a
        LEFT JOIN FETCH a.doctor d
        LEFT JOIN FETCH d.availableTimes
        WHERE d.id = :doctorId
        AND a.appointmentTime BETWEEN :start AND :end
    """)
    List<Appointment> findByDoctorIdAndAppointmentTimeBetween(
            Long doctorId,
            LocalDateTime start,
            LocalDateTime end
    );


    // 2️⃣ Filter by doctor + patient name (ignore case) + time range
    @Query("""
        SELECT DISTINCT a FROM Appointment a
        LEFT JOIN FETCH a.doctor d
        LEFT JOIN FETCH a.patient p
        WHERE d.id = :doctorId
        AND LOWER(p.name) LIKE LOWER(CONCAT('%', :patientName, '%'))
        AND a.appointmentTime BETWEEN :start AND :end
    """)
    List<Appointment> findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
            Long doctorId,
            String patientName,
            LocalDateTime start,
            LocalDateTime end
    );


    // 3️⃣ Delete all appointments by doctor
    @Modifying
    @Transactional
    void deleteAllByDoctorId(Long doctorId);


    // 4️⃣ Find all appointments for a patient
    List<Appointment> findByPatientId(Long patientId);


    // 5️⃣ Find patient appointments by status ordered by time
    List<Appointment> findByPatient_IdAndStatusOrderByAppointmentTimeAsc(
            Long patientId,
            int status
    );


    // 6️⃣ Filter by doctor name and patient ID
    @Query("""
        SELECT a FROM Appointment a
        JOIN a.doctor d
        WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :doctorName, '%'))
        AND a.patient.id = :patientId
    """)
    List<Appointment> filterByDoctorNameAndPatientId(
            String doctorName,
            Long patientId
    );


    // 7️⃣ Filter by doctor name + patient ID + status
    @Query("""
        SELECT a FROM Appointment a
        JOIN a.doctor d
        WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :doctorName, '%'))
        AND a.patient.id = :patientId
        AND a.status = :status
    """)
    List<Appointment> filterByDoctorNameAndPatientIdAndStatus(
            String doctorName,
            Long patientId,
            int status
    );
}
