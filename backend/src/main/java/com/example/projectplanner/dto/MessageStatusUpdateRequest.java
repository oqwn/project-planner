package com.example.projectplanner.dto;

import java.util.List;

public class MessageStatusUpdateRequest {
    private List<String> messageIds;
    
    public List<String> getMessageIds() {
        return messageIds;
    }
    
    public void setMessageIds(List<String> messageIds) {
        this.messageIds = messageIds;
    }
}