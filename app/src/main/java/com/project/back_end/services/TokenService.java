package com.project.back_end.services;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.project.back_end.models.Admin;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class TokenService {

    @Value("${jwt.secret}")
    private String secret;

    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public TokenService(AdminRepository adminRepository,
                        DoctorRepository doctorRepository,
                        PatientRepository patientRepository) {
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    /* ============================================================
       GET SIGNING KEY
       ============================================================ */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /* ============================================================
       GENERATE TOKEN (7 DAYS VALIDITY)
       ============================================================ */
    public String generateToken(String identifier, String role) {

    long expirationTime = 1000 * 60 * 60 * 24 * 7;

    return Jwts.builder()
            .setSubject(identifier)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
}


    /* ============================================================
       EXTRACT IDENTIFIER (EMAIL / USERNAME)
       ============================================================ */
    public String extractIdentifier(String token) {

        Claims claims = Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();



        return claims.getSubject();
    }

    /* ============================================================
       VALIDATE TOKEN
       ============================================================ */
    public boolean validateToken(String token, String user) {

        try {
            String identifier = extractIdentifier(token);

            switch (user.toLowerCase()) {

                case "admin":
                    Admin admin = adminRepository.findByUsername(identifier);
                    return admin != null;

                case "doctor":
                    Doctor doctor = doctorRepository.findByEmail(identifier);
                    return doctor != null;

                case "patient":
                    Patient patient = patientRepository.findByEmail(identifier);
                    return patient != null;

                default:
                    return false;
            }

        } catch (Exception e) {
            return false; // invalid or expired token
        }
    }
}
