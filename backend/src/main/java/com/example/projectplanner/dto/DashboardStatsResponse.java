package com.example.projectplanner.dto;

public class DashboardStatsResponse {
    private int totalTasks;
    private int inProgressTasks;
    private int completedTasks;
    private int overdueTasks;
    
    private String totalTasksTrend;
    private String inProgressTrend;
    private String completedTrend;
    private String overdueTrend;
    
    // Getters and Setters
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
    
    public String getTotalTasksTrend() {
        return totalTasksTrend;
    }
    
    public void setTotalTasksTrend(String totalTasksTrend) {
        this.totalTasksTrend = totalTasksTrend;
    }
    
    public String getInProgressTrend() {
        return inProgressTrend;
    }
    
    public void setInProgressTrend(String inProgressTrend) {
        this.inProgressTrend = inProgressTrend;
    }
    
    public String getCompletedTrend() {
        return completedTrend;
    }
    
    public void setCompletedTrend(String completedTrend) {
        this.completedTrend = completedTrend;
    }
    
    public String getOverdueTrend() {
        return overdueTrend;
    }
    
    public void setOverdueTrend(String overdueTrend) {
        this.overdueTrend = overdueTrend;
    }
}