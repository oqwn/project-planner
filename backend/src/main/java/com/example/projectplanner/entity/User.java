package com.example.projectplanner.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class User {
    private UUID id;
    private String email;
    private String name;
    private String passwordHash;
    private UserRole role;
    private List<String> interests;
    private List<String> associations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public User() {}

    public User(String email, String name, String passwordHash, UserRole role) {
        this.id = UUID.randomUUID();
        this.email = email;
        this.name = name;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }

    public List<String> getAssociations() { return associations; }
    public void setAssociations(List<String> associations) { this.associations = associations; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum UserRole {
        ADMIN, PROJECT_MANAGER, TEAM_LEAD, MEMBER, VIEWER
    }
}