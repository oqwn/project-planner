package com.example.projectplanner.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class TimeEntry {
    private UUID id;
    private UUID taskId;
    private UUID userId;
    private LocalDate date;
    private BigDecimal hours;
    private String description;
    private LocalDateTime createdAt;

    // Constructors
    public TimeEntry() {}

    public TimeEntry(UUID taskId, UUID userId, LocalDate date, BigDecimal hours, String description) {
        this.id = UUID.randomUUID();
        this.taskId = taskId;
        this.userId = userId;
        this.date = date;
        this.hours = hours;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTaskId() { return taskId; }
    public void setTaskId(UUID taskId) { this.taskId = taskId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public BigDecimal getHours() { return hours; }
    public void setHours(BigDecimal hours) { this.hours = hours; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}