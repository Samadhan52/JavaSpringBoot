package com.project.back_end.DTO;

public class Login {

    // Unique identifier (email for Doctor/Patient, username for Admin)
    private String identifier;

    // User password
    private String password;

    // Default constructor (required for @RequestBody deserialization)
    public Login() {
    }

    // Getters and Setters

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
