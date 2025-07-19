package com.example.projectplanner.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class Task {
    private UUID id;
    private UUID projectId;
    private String name;
    private String description;
    private UUID assigneeId;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private BigDecimal estimatedHours;
    private UUID createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public Task() {}

    public Task(UUID projectId, String name, String description, UUID assigneeId, TaskPriority priority, LocalDate dueDate, BigDecimal estimatedHours, UUID createdBy) {
        this.id = UUID.randomUUID();
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.assigneeId = assigneeId;
        this.status = TaskStatus.TODO;
        this.priority = priority;
        this.dueDate = dueDate;
        this.estimatedHours = estimatedHours;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UUID getAssigneeId() { return assigneeId; }
    public void setAssigneeId(UUID assigneeId) { this.assigneeId = assigneeId; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BigDecimal getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(BigDecimal estimatedHours) { this.estimatedHours = estimatedHours; }

    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum TaskStatus {
        TODO, IN_PROGRESS, COMPLETED, PARKED
    }

    public enum TaskPriority {
        HIGH, MEDIUM, LOW
    }
}