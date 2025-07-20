package com.example.projectplanner.controller;

import com.example.projectplanner.dto.*;
import com.example.projectplanner.entity.DashboardStats;
import com.example.projectplanner.entity.Task;
import com.example.projectplanner.mapper.TaskMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Dashboard operations for Epic 1")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {
    
    @Autowired
    private TaskMapper taskMapper;
    
    @GetMapping("/stats/{projectId}")
    @Operation(summary = "Get dashboard statistics for a project")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(@PathVariable UUID projectId) {
        DashboardStats stats = taskMapper.getDashboardStats(projectId);
        
        DashboardStatsResponse response = new DashboardStatsResponse();
        response.setTotalTasks(stats.getTotalTasks());
        response.setInProgressTasks(stats.getInProgressTasks());
        response.setCompletedTasks(stats.getCompletedTasks());
        response.setOverdueTasks(stats.getOverdueTasks());
        
        // Calculate trend percentages (mock data for now)
        response.setTotalTasksTrend("+12%");
        response.setInProgressTrend("+8%");
        response.setCompletedTrend("+15%");
        response.setOverdueTrend("-3%");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/recent-tasks/{projectId}")
    @Operation(summary = "Get recent tasks for dashboard table")
    public ResponseEntity<List<DashboardTaskResponse>> getRecentTasks(
            @PathVariable UUID projectId,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Task> tasks = taskMapper.findByProjectId(projectId);
        List<DashboardTaskResponse> response = new ArrayList<>();
        
        // Get most recent tasks up to limit
        tasks.stream()
            .limit(limit)
            .forEach(task -> {
                DashboardTaskResponse taskResponse = new DashboardTaskResponse();
                taskResponse.setId(task.getId());
                taskResponse.setTitle(task.getTitle());
                taskResponse.setAssignee(task.getAssigneeName());
                taskResponse.setDueDate(task.getDueDate());
                taskResponse.setPriority(task.getPriority().getValue());
                taskResponse.setStatus(task.getStatus().getValue());
                response.add(taskResponse);
            });
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/recent-activities/{projectId}")
    @Operation(summary = "Get recent activities for dashboard")
    public ResponseEntity<List<ActivityResponse>> getRecentActivities(
            @PathVariable UUID projectId,
            @RequestParam(defaultValue = "10") int limit) {
        
        // TODO: Implement activity tracking query
        // For now, return mock data
        List<ActivityResponse> activities = new ArrayList<>();
        
        ActivityResponse activity1 = new ActivityResponse();
        activity1.setType("task_completed");
        activity1.setUser("Sarah Chen");
        activity1.setDescription("completed");
        activity1.setTargetItem("User authentication flow");
        activity1.setTimestamp("2 hours ago");
        activities.add(activity1);
        
        ActivityResponse activity2 = new ActivityResponse();
        activity2.setType("comment_added");
        activity2.setUser("Mike Johnson");
        activity2.setDescription("commented on");
        activity2.setTargetItem("API integration testing");
        activity2.setTimestamp("4 hours ago");
        activities.add(activity2);
        
        return ResponseEntity.ok(activities);
    }
    
    @GetMapping("/project-progress/{projectId}")
    @Operation(summary = "Get project progress overview")
    public ResponseEntity<List<ProjectProgressResponse>> getProjectProgress(@PathVariable UUID projectId) {
        // TODO: Implement project grouping
        // For now, return single project data
        List<ProjectProgressResponse> projects = new ArrayList<>();
        
        DashboardStats stats = taskMapper.getDashboardStats(projectId);
        
        ProjectProgressResponse project = new ProjectProgressResponse();
        project.setId(projectId);
        project.setName("Project Alpha");
        project.setProgress(calculateProgress(stats));
        project.setDueDate("2025-02-15");
        project.setStatus(determineProjectStatus(stats));
        project.setTasksCompleted(stats != null ? stats.getCompletedTasks() : 0);
        project.setTotalTasks(stats != null ? stats.getTotalTasks() : 0);
        
        projects.add(project);
        
        return ResponseEntity.ok(projects);
    }
    
    private int calculateProgress(DashboardStats stats) {
        if (stats == null || stats.getTotalTasks() == 0) return 0;
        return (int) ((stats.getCompletedTasks() * 100.0) / stats.getTotalTasks());
    }
    
    private String determineProjectStatus(DashboardStats stats) {
        if (stats == null) return "unknown";
        if (stats.getOverdueTasks() > 0) return "delayed";
        if (stats.getInProgressTasks() > stats.getCompletedTasks()) return "at-risk";
        return "on-track";
    }
}