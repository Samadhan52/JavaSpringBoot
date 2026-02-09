package com.project.back_end.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.back_end.models.Admin;
import com.project.back_end.services.CommonService;

@RestController
@RequestMapping("${api.path}admin")
public class AdminController {

    private final CommonService commonService;

    // Constructor injection
    public AdminController(CommonService commonService) {
        this.commonService = commonService;
    }

    /**
     * Admin login endpoint
     * @param admin Admin credentials (username & password)
     * @return ResponseEntity with token or error message
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> adminLogin(
            @RequestBody Admin admin) {
        return commonService.validateAdmin(admin);
    }
}
