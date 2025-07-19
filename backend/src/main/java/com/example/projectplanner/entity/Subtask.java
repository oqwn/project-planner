package com.example.projectplanner.entity;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class Subtask {
    private UUID id;
    private UUID taskId;
    private String title;
    private boolean completed;
    private List<UUID> dependsOn;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public UUID getTaskId() {
        return taskId;
    }
    
    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public boolean isCompleted() {
        return completed;
    }
    
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
    
    
    public List<UUID> getDependsOn() {
        return dependsOn;
    }
    
    public void setDependsOn(List<UUID> dependsOn) {
        this.dependsOn = dependsOn;
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