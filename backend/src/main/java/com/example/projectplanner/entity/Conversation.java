package com.example.projectplanner.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public class Conversation {
    private UUID id;
    private String name;
    private ConversationType type;
    private UUID projectId; // null for direct messages
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private String lastMessage;
    private OffsetDateTime lastMessageAt;
    private UUID createdBy;

    public enum ConversationType {
        DIRECT_MESSAGE,
        GROUP_CHAT
    }

    // Constructors
    public Conversation() {}

    public Conversation(UUID id, String name, ConversationType type, UUID projectId, 
                       OffsetDateTime createdAt, OffsetDateTime updatedAt, 
                       String lastMessage, OffsetDateTime lastMessageAt, UUID createdBy) {
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

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public OffsetDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(OffsetDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
}