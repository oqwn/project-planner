package com.example.projectplanner.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class Task {
    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private UUID assigneeId;
    private String assigneeName; // Joined from users table
    private UUID projectId;
    private UUID createdBy;
    private String createdByName; // Joined from users table
    private LocalDate dueDate;
    private BigDecimal estimatedHours;
    private BigDecimal actualHours;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    // Related entities
    private List<Subtask> subtasks;
    private List<TaskComment> comments;
    private List<TaskAttachment> attachments;
    private List<TaskReminder> reminders;
    private List<String> tags;
    
    public enum TaskStatus {
        TODO("todo"),
        IN_PROGRESS("in-progress"),
        COMPLETED("completed"),
        PARKED("parked");
        
        private final String value;
        
        TaskStatus(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        public static TaskStatus fromValue(String value) {
            for (TaskStatus status : TaskStatus.values()) {
                if (status.value.equals(value)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Unknown task status: " + value);
        }
    }
    
    public enum TaskPriority {
        LOW("low"),
        MEDIUM("medium"),
        HIGH("high");
        
        private final String value;
        
        TaskPriority(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        public static TaskPriority fromValue(String value) {
            for (TaskPriority priority : TaskPriority.values()) {
                if (priority.value.equals(value)) {
                    return priority;
                }
            }
            throw new IllegalArgumentException("Unknown task priority: " + value);
        }
    }
    
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
    
    public TaskStatus getStatus() {
        return status;
    }
    
    public void setStatus(TaskStatus status) {
        this.status = status;
    }
    
    public TaskPriority getPriority() {
        return priority;
    }
    
    public void setPriority(TaskPriority priority) {
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
    
    public BigDecimal getEstimatedHours() {
        return estimatedHours;
    }
    
    public void setEstimatedHours(BigDecimal estimatedHours) {
        this.estimatedHours = estimatedHours;
    }
    
    public BigDecimal getActualHours() {
        return actualHours;
    }
    
    public void setActualHours(BigDecimal actualHours) {
        this.actualHours = actualHours;
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
    
    public List<Subtask> getSubtasks() {
        return subtasks;
    }
    
    public void setSubtasks(List<Subtask> subtasks) {
        this.subtasks = subtasks;
    }
    
    public List<TaskComment> getComments() {
        return comments;
    }
    
    public void setComments(List<TaskComment> comments) {
        this.comments = comments;
    }
    
    public List<TaskAttachment> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<TaskAttachment> attachments) {
        this.attachments = attachments;
    }
    
    public List<TaskReminder> getReminders() {
        return reminders;
    }
    
    public void setReminders(List<TaskReminder> reminders) {
        this.reminders = reminders;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}