package com.example.projectplanner.dto;

import java.util.List;
import java.util.UUID;

public class SubtaskResponse {
    private UUID id;
    private String title;
    private boolean completed;
    private List<UUID> dependsOn;
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
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
}