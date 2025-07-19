package com.example.projectplanner.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class CommentResponse {
    private UUID id;
    private String content;
    private String author;
    private UUID authorId;
    private LocalDateTime timestamp;
    private List<UUID> mentions;
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
    
    public UUID getAuthorId() {
        return authorId;
    }
    
    public void setAuthorId(UUID authorId) {
        this.authorId = authorId;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public List<UUID> getMentions() {
        return mentions;
    }
    
    public void setMentions(List<UUID> mentions) {
        this.mentions = mentions;
    }
}