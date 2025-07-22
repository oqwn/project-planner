package com.example.projectplanner.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public class ConversationParticipant {
    private UUID id;
    private UUID conversationId;
    private UUID userId;
    private OffsetDateTime joinedAt;
    private OffsetDateTime lastReadAt;
    private boolean isActive;

    // Constructors
    public ConversationParticipant() {}

    public ConversationParticipant(UUID id, UUID conversationId, UUID userId, 
                                 OffsetDateTime joinedAt, OffsetDateTime lastReadAt, boolean isActive) {
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

    public OffsetDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(OffsetDateTime joinedAt) { this.joinedAt = joinedAt; }

    public OffsetDateTime getLastReadAt() { return lastReadAt; }
    public void setLastReadAt(OffsetDateTime lastReadAt) { this.lastReadAt = lastReadAt; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}