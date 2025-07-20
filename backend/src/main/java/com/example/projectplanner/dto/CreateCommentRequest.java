package com.example.projectplanner.dto;

import java.util.List;
import java.util.UUID;

public class CreateCommentRequest {
    private String content;
    private UUID userId;
    private List<UUID> mentions;
    
    // Getters and Setters
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public UUID getUserId() {
        return userId;
    }
    
    public void setUserId(UUID userId) {
        this.userId = userId;
    }
    
    public List<UUID> getMentions() {
        return mentions;
    }
    
    public void setMentions(List<UUID> mentions) {
        this.mentions = mentions;
    }
}