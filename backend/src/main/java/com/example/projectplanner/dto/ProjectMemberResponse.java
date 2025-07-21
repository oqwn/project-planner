package com.example.projectplanner.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class ProjectMemberResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private String userEmail;
    private String role;
    private OffsetDateTime joinedAt;
    private boolean isActive;

    // Constructors
    public ProjectMemberResponse() {}

    public ProjectMemberResponse(UUID id, UUID userId, String userName, String userEmail, 
                                String role, OffsetDateTime joinedAt, boolean isActive) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.role = role;
        this.joinedAt = joinedAt;
        this.isActive = isActive;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public OffsetDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(OffsetDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}