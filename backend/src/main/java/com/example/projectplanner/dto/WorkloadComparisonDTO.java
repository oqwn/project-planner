package com.example.projectplanner.dto;

import java.util.List;
import java.util.UUID;

public class WorkloadComparisonDTO {
    private UUID userId;
    private String userName;
    private List<TaskWorkload> tasks;
    private Integer totalEstimatedHours;
    private Integer totalActualHours;
    private Double variancePercentage;

    public static class TaskWorkload {
        private UUID taskId;
        private String taskTitle;
        private Integer estimatedHours;
        private Integer actualHours;
        private Double variance;
        private String status;

        // Getters and Setters
        public UUID getTaskId() {
            return taskId;
        }

        public void setTaskId(UUID taskId) {
            this.taskId = taskId;
        }

        public String getTaskTitle() {
            return taskTitle;
        }

        public void setTaskTitle(String taskTitle) {
            this.taskTitle = taskTitle;
        }

        public Integer getEstimatedHours() {
            return estimatedHours;
        }

        public void setEstimatedHours(Integer estimatedHours) {
            this.estimatedHours = estimatedHours;
        }

        public Integer getActualHours() {
            return actualHours;
        }

        public void setActualHours(Integer actualHours) {
            this.actualHours = actualHours;
        }

        public Double getVariance() {
            return variance;
        }

        public void setVariance(Double variance) {
            this.variance = variance;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public List<TaskWorkload> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskWorkload> tasks) {
        this.tasks = tasks;
    }

    public Integer getTotalEstimatedHours() {
        return totalEstimatedHours;
    }

    public void setTotalEstimatedHours(Integer totalEstimatedHours) {
        this.totalEstimatedHours = totalEstimatedHours;
    }

    public Integer getTotalActualHours() {
        return totalActualHours;
    }

    public void setTotalActualHours(Integer totalActualHours) {
        this.totalActualHours = totalActualHours;
    }

    public Double getVariancePercentage() {
        return variancePercentage;
    }

    public void setVariancePercentage(Double variancePercentage) {
        this.variancePercentage = variancePercentage;
    }
}