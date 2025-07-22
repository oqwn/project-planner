package com.example.projectplanner.dto;

public class MediaUploadResponse {
    private String messageId;
    private String mediaUrl;
    private String status;
    private String error;
    
    public MediaUploadResponse() {}
    
    public MediaUploadResponse(String messageId, String mediaUrl, String status, String error) {
        this.messageId = messageId;
        this.mediaUrl = mediaUrl;
        this.status = status;
        this.error = error;
    }
    
    // Getters and Setters
    public String getMessageId() {
        return messageId;
    }
    
    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
    
    public String getMediaUrl() {
        return mediaUrl;
    }
    
    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
}