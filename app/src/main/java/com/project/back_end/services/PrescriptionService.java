package com.project.back_end.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.back_end.models.Prescription;
import com.project.back_end.repo.PrescriptionRepository;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    /* ============================================================
       1. SAVE PRESCRIPTION
       ============================================================ */

    public boolean savePrescription(Prescription prescription) {

        // Check if prescription already exists
        List<Prescription> existing =
                prescriptionRepository.findByAppointmentId(
                        prescription.getAppointmentId());

        if (!existing.isEmpty()) {
            return false;   // already exists
        }

        prescriptionRepository.save(prescription);
        return true;
    }

    /* ============================================================
       2. GET PRESCRIPTION
       ============================================================ */

    public Prescription getPrescription(Long appointmentId) {

        List<Prescription> prescriptions =
                prescriptionRepository.findByAppointmentId(appointmentId);

        if (prescriptions.isEmpty()) {
            return null;
        }

        return prescriptions.get(0);
    }
}
