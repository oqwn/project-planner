package com.example.projectplanner.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ConversationParticipantResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private String userEmail;
    private LocalDateTime joinedAt;
    private LocalDateTime lastReadAt;
    private boolean isOnline;

    public ConversationParticipantResponse() {}

    public ConversationParticipantResponse(UUID id, UUID userId, String userName, String userEmail,
                                         LocalDateTime joinedAt, LocalDateTime lastReadAt, boolean isOnline) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.joinedAt = joinedAt;
        this.lastReadAt = lastReadAt;
        this.isOnline = isOnline;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public LocalDateTime getLastReadAt() { return lastReadAt; }
    public void setLastReadAt(LocalDateTime lastReadAt) { this.lastReadAt = lastReadAt; }

    public boolean isOnline() { return isOnline; }
    public void setOnline(boolean online) { isOnline = online; }
}