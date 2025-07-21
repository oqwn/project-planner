package com.example.projectplanner.entity;

import java.time.LocalDateTime;
import java.util.UUID;

public class Conversation {
    private UUID id;
    private String name;
    private ConversationType type;
    private UUID projectId; // null for direct messages
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private UUID createdBy;

    public enum ConversationType {
        DIRECT_MESSAGE,
        GROUP_CHAT
    }

    // Constructors
    public Conversation() {}

    public Conversation(UUID id, String name, ConversationType type, UUID projectId, 
                       LocalDateTime createdAt, LocalDateTime updatedAt, 
                       String lastMessage, LocalDateTime lastMessageAt, UUID createdBy) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.projectId = projectId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastMessage = lastMessage;
        this.lastMessageAt = lastMessageAt;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ConversationType getType() { return type; }
    public void setType(ConversationType type) { this.type = type; }

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
}