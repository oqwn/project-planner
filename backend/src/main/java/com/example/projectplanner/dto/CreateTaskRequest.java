package com.example.projectplanner.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class CreateTaskRequest {
    private String title;
    private String description;
    private String priority;
    private UUID assigneeId;
    private UUID projectId;
    private UUID createdBy;
    private LocalDate dueDate;
    private double estimatedHours;
    private List<CreateSubtaskRequest> subtasks;
    private List<String> tags;
    
    // Getters and Setters
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
    
    public List<CreateSubtaskRequest> getSubtasks() {
        return subtasks;
    }
    
    public void setSubtasks(List<CreateSubtaskRequest> subtasks) {
        this.subtasks = subtasks;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}