package com.example.projectplanner.dto;

import com.example.projectplanner.entity.User;

public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private User.UserRole role;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String name, User.UserRole role) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User.UserRole getRole() {
        return role;
    }

    public void setRole(User.UserRole role) {
        this.role = role;
    }
}