package com.example.projectplanner.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReminderResponse {
    private UUID id;
    private LocalDateTime datetime;
    private String message;
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public LocalDateTime getDatetime() {
        return datetime;
    }
    
    public void setDatetime(LocalDateTime datetime) {
        this.datetime = datetime;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}