package com.example.projectplanner.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private UUID assigneeId;
    private String assigneeName;
    private UUID projectId;
    private UUID createdBy;
    private String createdByName;
    private LocalDate dueDate;
    private double estimatedHours;
    private Double actualHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<SubtaskResponse> subtasks;
    private List<CommentResponse> comments;
    private List<AttachmentResponse> attachments;
    private List<ReminderResponse> reminders;
    private List<String> tags;
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
    }
    
    public UUID getAssigneeId() {
        return assigneeId;
    }
    
    public void setAssigneeId(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }
    
    public String getAssigneeName() {
        return assigneeName;
    }
    
    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
    }
    
    public UUID getProjectId() {
        return projectId;
    }
    
    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }
    
    public UUID getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }
    
    public String getCreatedByName() {
        return createdByName;
    }
    
    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public double getEstimatedHours() {
        return estimatedHours;
    }
    
    public void setEstimatedHours(double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }
    
    public Double getActualHours() {
        return actualHours;
    }
    
    public void setActualHours(Double actualHours) {
        this.actualHours = actualHours;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<SubtaskResponse> getSubtasks() {
        return subtasks;
    }
    
    public void setSubtasks(List<SubtaskResponse> subtasks) {
        this.subtasks = subtasks;
    }
    
    public List<CommentResponse> getComments() {
        return comments;
    }
    
    public void setComments(List<CommentResponse> comments) {
        this.comments = comments;
    }
    
    public List<AttachmentResponse> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<AttachmentResponse> attachments) {
        this.attachments = attachments;
    }
    
    public List<ReminderResponse> getReminders() {
        return reminders;
    }
    
    public void setReminders(List<ReminderResponse> reminders) {
        this.reminders = reminders;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}