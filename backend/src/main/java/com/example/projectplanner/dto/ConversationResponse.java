package com.example.projectplanner.dto;

import com.example.projectplanner.entity.Conversation;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ConversationResponse {
    private UUID id;
    private String name;
    private Conversation.ConversationType type;
    private UUID projectId;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private int unreadCount;
    private List<ConversationParticipantResponse> participants;
    private String avatarUrl;

    public ConversationResponse() {}

    public ConversationResponse(UUID id, String name, Conversation.ConversationType type, 
                              UUID projectId, String lastMessage, LocalDateTime lastMessageAt,
                              int unreadCount, List<ConversationParticipantResponse> participants,
                              String avatarUrl) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.projectId = projectId;
        this.lastMessage = lastMessage;
        this.lastMessageAt = lastMessageAt;
        this.unreadCount = unreadCount;
        this.participants = participants;
        this.avatarUrl = avatarUrl;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Conversation.ConversationType getType() { return type; }
    public void setType(Conversation.ConversationType type) { this.type = type; }

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public int getUnreadCount() { return unreadCount; }
    public void setUnreadCount(int unreadCount) { this.unreadCount = unreadCount; }

    public List<ConversationParticipantResponse> getParticipants() { return participants; }
    public void setParticipants(List<ConversationParticipantResponse> participants) { this.participants = participants; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}