package com.example.projectplanner.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class Subtask {
    private UUID id;
    private UUID taskId;
    private String title;
    private boolean completed;
    private int position;
    private List<UUID> dependsOn;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
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
    
    public int getPosition() {
        return position;
    }
    
    public void setPosition(int position) {
        this.position = position;
    }
    
    public List<UUID> getDependsOn() {
        return dependsOn;
    }
    
    public void setDependsOn(List<UUID> dependsOn) {
        this.dependsOn = dependsOn;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}