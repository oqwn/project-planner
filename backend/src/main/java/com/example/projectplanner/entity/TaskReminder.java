package com.example.projectplanner.entity;

import java.time.LocalDateTime;
import java.util.UUID;

public class TaskReminder {
    private UUID id;
    private UUID taskId;
    private UUID userId;
    private LocalDateTime reminderDatetime;
    private String message;
    private boolean isSent;
    private LocalDateTime createdAt;
    
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
    
    public UUID getUserId() {
        return userId;
    }
    
    public void setUserId(UUID userId) {
        this.userId = userId;
    }
    
    public LocalDateTime getReminderDatetime() {
        return reminderDatetime;
    }
    
    public void setReminderDatetime(LocalDateTime reminderDatetime) {
        this.reminderDatetime = reminderDatetime;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public boolean isSent() {
        return isSent;
    }
    
    public void setSent(boolean sent) {
        isSent = sent;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}