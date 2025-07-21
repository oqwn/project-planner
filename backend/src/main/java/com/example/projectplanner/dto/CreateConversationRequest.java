package com.example.projectplanner.dto;

import com.example.projectplanner.entity.Conversation;
import java.util.List;
import java.util.UUID;

public class CreateConversationRequest {
    private String name;
    private Conversation.ConversationType type;
    private UUID projectId; // null for direct messages
    private List<UUID> participantIds;

    public CreateConversationRequest() {}

    public CreateConversationRequest(String name, Conversation.ConversationType type, 
                                   UUID projectId, List<UUID> participantIds) {
        this.name = name;
        this.type = type;
        this.projectId = projectId;
        this.participantIds = participantIds;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Conversation.ConversationType getType() { return type; }
    public void setType(Conversation.ConversationType type) { this.type = type; }

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public List<UUID> getParticipantIds() { return participantIds; }
    public void setParticipantIds(List<UUID> participantIds) { this.participantIds = participantIds; }
}