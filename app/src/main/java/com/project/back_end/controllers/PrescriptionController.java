package com.project.back_end.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.CommonService;

@RestController
@RequestMapping("${api.path}" + "prescription")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final CommonService commonService;

    public PrescriptionController(PrescriptionService prescriptionService,
                                  CommonService commonService) {
        this.prescriptionService = prescriptionService;
        this.commonService = commonService;
    }

    /* ============================================================
       1️⃣ SAVE PRESCRIPTION
       ============================================================ */
    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> savePrescription(
            @PathVariable String token,
            @RequestBody Prescription prescription) {

        // validate doctor token
        Map<String, String> validationResult =
                commonService.validateToken(token, "doctor");

        // if map NOT empty → token invalid
        if (!validationResult.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(validationResult);
        }

        boolean saved = prescriptionService.savePrescription(prescription);

        if (saved) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Prescription saved successfully"));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Unable to save prescription"));
    }

    /* ============================================================
       2️⃣ GET PRESCRIPTION
       ============================================================ */
    @GetMapping("/{appointmentId}/{token}")
    public ResponseEntity<?> getPrescription(
            @PathVariable Long appointmentId,
            @PathVariable String token) {

        // validate doctor token
        Map<String, String> validationResult =
                commonService.validateToken(token, "doctor");

        if (!validationResult.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(validationResult);
        }

        Prescription prescription =
                prescriptionService.getPrescription(appointmentId);

        if (prescription == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message",
                            "No prescription found for this appointment"));
        }

        return ResponseEntity.ok(prescription);
    }
}
