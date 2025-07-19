package com.example.projectplanner.entity;

import java.util.UUID;

public class DashboardStats {
    private UUID projectId;
    private int totalTasks;
    private int inProgressTasks;
    private int completedTasks;
    private int overdueTasks;
    
    // Getters and Setters
    public UUID getProjectId() {
        return projectId;
    }
    
    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }
    
    public int getTotalTasks() {
        return totalTasks;
    }
    
    public void setTotalTasks(int totalTasks) {
        this.totalTasks = totalTasks;
    }
    
    public int getInProgressTasks() {
        return inProgressTasks;
    }
    
    public void setInProgressTasks(int inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }
    
    public int getCompletedTasks() {
        return completedTasks;
    }
    
    public void setCompletedTasks(int completedTasks) {
        this.completedTasks = completedTasks;
    }
    
    public int getOverdueTasks() {
        return overdueTasks;
    }
    
    public void setOverdueTasks(int overdueTasks) {
        this.overdueTasks = overdueTasks;
    }
}