package com.example.projectplanner.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public class MessageStatusTracker {
    private UUID id;
    private UUID messageId;
    private UUID userId;
    private boolean isDelivered;
    private boolean isRead;
    private OffsetDateTime deliveredAt;
    private OffsetDateTime readAt;
    private OffsetDateTime createdAt;
    
    public MessageStatusTracker() {
        this.id = UUID.randomUUID();
        this.createdAt = OffsetDateTime.now();
        this.isDelivered = false;
        this.isRead = false;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public UUID getMessageId() {
        return messageId;
    }
    
    public void setMessageId(UUID messageId) {
        this.messageId = messageId;
    }
    
    public UUID getUserId() {
        return userId;
    }
    
    public void setUserId(UUID userId) {
        this.userId = userId;
    }
    
    public boolean isDelivered() {
        return isDelivered;
    }
    
    public void setDelivered(boolean delivered) {
        isDelivered = delivered;
        if (delivered && deliveredAt == null) {
            deliveredAt = OffsetDateTime.now();
        }
    }
    
    public boolean isRead() {
        return isRead;
    }
    
    public void setRead(boolean read) {
        isRead = read;
        if (read) {
            if (!isDelivered) {
                setDelivered(true);
            }
            if (readAt == null) {
                readAt = OffsetDateTime.now();
            }
        }
    }
    
    public OffsetDateTime getDeliveredAt() {
        return deliveredAt;
    }
    
    public void setDeliveredAt(OffsetDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
    
    public OffsetDateTime getReadAt() {
        return readAt;
    }
    
    public void setReadAt(OffsetDateTime readAt) {
        this.readAt = readAt;
    }
    
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}