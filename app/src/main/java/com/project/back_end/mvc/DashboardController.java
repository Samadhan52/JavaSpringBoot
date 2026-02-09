package com.project.back_end.mvc;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.back_end.services.CommonService; // Adjust if your service name is different

@Controller
public class DashboardController {

    // Autowire the service responsible for token validation
    @Autowired
    private CommonService commonService;

    /**
     * Admin Dashboard Access
     * URL: /adminDashboard/{token}
     */
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {

        // Validate token for admin role
        Map<String, String> validationResult = commonService.validateToken(token, "admin");

        // If map is empty → token valid
        if (validationResult.isEmpty()) {
            return "admin/adminDashboard";  // Thymeleaf template: templates/admin/adminDashboard.html
        }

        // If token invalid → redirect to home/login page
        return "redirect:/";
    }

    /**
     * Doctor Dashboard Access
     * URL: /doctorDashboard/{token}
     */
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {

        // Validate token for doctor role
        Map<String, String> validationResult = commonService.validateToken(token, "doctor");

        // If map is empty → token valid
        if (validationResult.isEmpty()) {
            return "doctor/doctorDashboard"; // templates/doctor/doctorDashboard.html
        }

        // If invalid → redirect
        return "redirect:/";
    }
}
