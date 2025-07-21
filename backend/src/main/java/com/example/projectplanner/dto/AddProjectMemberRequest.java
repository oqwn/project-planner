package com.example.projectplanner.dto;

import java.util.UUID;

public class AddProjectMemberRequest {
    private UUID userId;
    private String role; // PROJECT_OWNER, PROJECT_MANAGER, MEMBER, VIEWER

    // Constructors
    public AddProjectMemberRequest() {}

    public AddProjectMemberRequest(UUID userId, String role) {
        this.userId = userId;
        this.role = role;
    }

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}