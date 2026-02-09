package com.project.back_end.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.CommonService;

@RestController
@RequestMapping("/prescription")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final CommonService commonService;

    public PrescriptionController(PrescriptionService prescriptionService,
                                  CommonService commonService) {
        this.prescriptionService = prescriptionService;
        this.commonService = commonService;
    }

    @PostMapping("/{token}")
    public ResponseEntity<?> savePrescription(
            @PathVariable String token,
            @RequestBody Prescription prescription) {

        ResponseEntity<Map<String, String>> validationResult =
                commonService.validateToken(token, "doctor");

        if (!validationResult.getStatusCode().is2xxSuccessful()) {
            return validationResult;
        }

        boolean saved = prescriptionService.savePrescription(prescription);

        if (saved) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Prescription saved successfully"));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Unable to save prescription"));
    }

    @GetMapping("/{appointmentId}/{token}")
    public ResponseEntity<?> getPrescription(
            @PathVariable Long appointmentId,
            @PathVariable String token) {

        ResponseEntity<Map<String, String>> validationResult =
                commonService.validateToken(token, "doctor");

        if (!validationResult.getStatusCode().is2xxSuccessful()) {
            return validationResult;
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
