package com.example.projectplanner.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public class ProjectMember {
    private UUID id;
    private UUID projectId;
    private UUID userId;
    private ProjectMemberRole role;
    private OffsetDateTime joinedAt;
    private UUID invitedBy;
    private boolean isActive;
    
    // Additional fields for join queries
    private String userName;
    private String userEmail;
    private String projectName;

    // Constructors
    public ProjectMember() {}

    public ProjectMember(UUID projectId, UUID userId, ProjectMemberRole role) {
        this.id = UUID.randomUUID();
        this.projectId = projectId;
        this.userId = userId;
        this.role = role;
        this.joinedAt = OffsetDateTime.now();
        this.isActive = true;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public ProjectMemberRole getRole() {
        return role;
    }

    public void setRole(ProjectMemberRole role) {
        this.role = role;
    }

    public OffsetDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(OffsetDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public UUID getInvitedBy() {
        return invitedBy;
    }

    public void setInvitedBy(UUID invitedBy) {
        this.invitedBy = invitedBy;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
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

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public enum ProjectMemberRole {
        PROJECT_OWNER("Project Owner"),
        PROJECT_MANAGER("Project Manager"),
        MEMBER("Member"),
        VIEWER("Viewer");

        private final String displayName;

        ProjectMemberRole(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}