package com.example.projectplanner.entity;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public class TeamAvailability {
    private UUID id;
    private UUID userId;
    private LocalDate date;
    private AvailabilityStatus status;
    private String notes;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public enum AvailabilityStatus {
        AVAILABLE, BUSY, OUT_OF_OFFICE, HOLIDAY, SICK_LEAVE
    }

    // Constructors
    public TeamAvailability() {
        this.id = UUID.randomUUID();
        this.status = AvailabilityStatus.AVAILABLE;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public TeamAvailability(UUID userId, LocalDate date, AvailabilityStatus status) {
        this();
        this.userId = userId;
        this.date = date;
        this.status = status;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public AvailabilityStatus getStatus() {
        return status;
    }

    public void setStatus(AvailabilityStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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