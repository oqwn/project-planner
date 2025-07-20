package com.example.projectplanner.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class to generate BCrypt password hashes for testing
 * Run this to generate hashes for test users
 */
public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Generate hashes for our test passwords
        String password123Hash = encoder.encode("password123");
        String admin123Hash = encoder.encode("admin123");
        
        System.out.println("BCrypt Hashes for Test Users:");
        System.out.println("password123: " + password123Hash);
        System.out.println("admin123: " + admin123Hash);
        
        // Verify the hashes work
        System.out.println("\nVerification:");
        System.out.println("password123 matches: " + encoder.matches("password123", password123Hash));
        System.out.println("admin123 matches: " + encoder.matches("admin123", admin123Hash));
    }
}