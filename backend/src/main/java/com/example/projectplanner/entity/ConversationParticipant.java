package com.example.projectplanner.entity;

import java.time.LocalDateTime;
import java.util.UUID;

public class ConversationParticipant {
    private UUID id;
    private UUID conversationId;
    private UUID userId;
    private LocalDateTime joinedAt;
    private LocalDateTime lastReadAt;
    private boolean isActive;

    // Constructors
    public ConversationParticipant() {}

    public ConversationParticipant(UUID id, UUID conversationId, UUID userId, 
                                 LocalDateTime joinedAt, LocalDateTime lastReadAt, boolean isActive) {
        this.id = id;
        this.conversationId = conversationId;
        this.userId = userId;
        this.joinedAt = joinedAt;
        this.lastReadAt = lastReadAt;
        this.isActive = isActive;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getConversationId() { return conversationId; }
    public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public LocalDateTime getLastReadAt() { return lastReadAt; }
    public void setLastReadAt(LocalDateTime lastReadAt) { this.lastReadAt = lastReadAt; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}