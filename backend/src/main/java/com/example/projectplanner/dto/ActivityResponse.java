package com.example.projectplanner.dto;

public class ActivityResponse {
    private String type;
    private String user;
    private String description;
    private String targetItem;
    private String timestamp;
    
    // Getters and Setters
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getUser() {
        return user;
    }
    
    public void setUser(String user) {
        this.user = user;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getTargetItem() {
        return targetItem;
    }
    
    public void setTargetItem(String targetItem) {
        this.targetItem = targetItem;
    }
    
    public String getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}