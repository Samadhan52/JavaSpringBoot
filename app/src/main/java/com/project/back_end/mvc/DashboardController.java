package com.project.back_end.mvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.back_end.services.CommonService;

@Controller
public class DashboardController {

    @Autowired
    private CommonService commonService;

    /**
     * Admin Dashboard Access
     * URL: /adminDashboard/{token}
     */
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {

        ResponseEntity<?> validationResult =
                commonService.validateToken(token, "admin");

        if (validationResult.getStatusCode().is2xxSuccessful()) {
            return "admin/adminDashboard";
        }

        return "redirect:/";
    }

    /**
     * Doctor Dashboard Access
     * URL: /doctorDashboard/{token}
     */
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {

        ResponseEntity<?> validationResult =
                commonService.validateToken(token, "doctor");

        if (validationResult.getStatusCode().is2xxSuccessful()) {
            return "doctor/doctorDashboard";
        }

        return "redirect:/";
    }
}
