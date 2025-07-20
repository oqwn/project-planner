package com.example.projectplanner.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class UpdateTaskRequest {
    private String title;
    private String description;
    private String status;
    private String priority;
    private UUID assigneeId;
    private LocalDate dueDate;
    private Double estimatedHours;
    private Double actualHours;
    private List<String> tags;
    private List<UpdateSubtaskRequest> subtasks;
    
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
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public Double getEstimatedHours() {
        return estimatedHours;
    }
    
    public void setEstimatedHours(Double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }
    
    public Double getActualHours() {
        return actualHours;
    }
    
    public void setActualHours(Double actualHours) {
        this.actualHours = actualHours;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public List<UpdateSubtaskRequest> getSubtasks() {
        return subtasks;
    }
    
    public void setSubtasks(List<UpdateSubtaskRequest> subtasks) {
        this.subtasks = subtasks;
    }
}