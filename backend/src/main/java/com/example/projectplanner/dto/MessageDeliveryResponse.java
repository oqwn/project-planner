package com.example.projectplanner.dto;

import java.time.LocalDateTime;

public class MessageDeliveryResponse {
    private String messageId;
    private String clientMessageId;
    private String status; // sent, delivered, read, failed
    private LocalDateTime timestamp;
    private String error;
    
    public MessageDeliveryResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    public MessageDeliveryResponse(String messageId, String clientMessageId, String status, String error) {
        this.messageId = messageId;
        this.clientMessageId = clientMessageId;
        this.status = status;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getMessageId() {
        return messageId;
    }
    
    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
    
    public String getClientMessageId() {
        return clientMessageId;
    }
    
    public void setClientMessageId(String clientMessageId) {
        this.clientMessageId = clientMessageId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
}