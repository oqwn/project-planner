package com.example.projectplanner.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public class Milestone {
    private UUID id;
    private UUID projectId;
    private String name;
    private String description;
    private OffsetDateTime targetDate;
    private MilestoneStatus status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public enum MilestoneStatus {
        PLANNED, IN_PROGRESS, COMPLETED, DELAYED
    }

    // Constructors
    public Milestone() {
        this.id = UUID.randomUUID();
        this.status = MilestoneStatus.PLANNED;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public Milestone(UUID projectId, String name, OffsetDateTime targetDate) {
        this();
        this.projectId = projectId;
        this.name = name;
        this.targetDate = targetDate;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public OffsetDateTime getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(OffsetDateTime targetDate) {
        this.targetDate = targetDate;
    }

    public MilestoneStatus getStatus() {
        return status;
    }

    public void setStatus(MilestoneStatus status) {
        this.status = status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}