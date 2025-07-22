package com.example.projectplanner.entity;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class ChatMessage {
    private UUID id;
    private UUID conversationId;
    private UUID projectId; // Keep for backward compatibility, null for DMs
    private UUID senderId;
    private String content;
    private MessageType type;
    private UUID replyToMessageId;
    private List<String> mentions;
    private List<UUID> attachmentIds;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private boolean isDeleted;
    private String clientMessageId;
    private MessageStatus status;

    public enum MessageType {
        TEXT, FILE, SYSTEM
    }
    
    public enum MessageStatus {
        PENDING, SENT, DELIVERED, READ, FAILED
    }

    // Constructors
    public ChatMessage() {
        this.id = UUID.randomUUID();
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
        this.isDeleted = false;
        this.status = MessageStatus.SENT;
    }

    public ChatMessage(UUID conversationId, UUID senderId, String content, MessageType type) {
        this.id = UUID.randomUUID();
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
        this.type = type;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
        this.isDeleted = false;
        this.status = MessageStatus.SENT;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getConversationId() {
        return conversationId;
    }

    public void setConversationId(UUID conversationId) {
        this.conversationId = conversationId;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public UUID getReplyToMessageId() {
        return replyToMessageId;
    }

    public void setReplyToMessageId(UUID replyToMessageId) {
        this.replyToMessageId = replyToMessageId;
    }

    public List<String> getMentions() {
        return mentions;
    }

    public void setMentions(List<String> mentions) {
        this.mentions = mentions;
    }

    public List<UUID> getAttachmentIds() {
        return attachmentIds;
    }

    public void setAttachmentIds(List<UUID> attachmentIds) {
        this.attachmentIds = attachmentIds;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }
    
    public String getClientMessageId() {
        return clientMessageId;
    }
    
    public void setClientMessageId(String clientMessageId) {
        this.clientMessageId = clientMessageId;
    }
    
    public MessageStatus getStatus() {
        return status;
    }
    
    public void setStatus(MessageStatus status) {
        this.status = status;
    }
}