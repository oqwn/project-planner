package com.example.projectplanner.controller;

import com.example.projectplanner.dto.*;
import com.example.projectplanner.entity.Task;
import com.example.projectplanner.entity.DashboardStats;
import com.example.projectplanner.entity.Subtask;
import com.example.projectplanner.mapper.TaskMapper;
import com.example.projectplanner.mapper.SubtaskMapper;
import com.example.projectplanner.mapper.UserMapper;
import com.example.projectplanner.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Task Management", description = "Task management operations")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {
    
    @Autowired
    private TaskMapper taskMapper;
    
    @Autowired
    private SubtaskMapper subtaskMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get all tasks for a project")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(@PathVariable UUID projectId) {
        List<Task> tasks = taskMapper.findByProjectId(projectId);
        List<TaskResponse> response = new ArrayList<>();
        
        for (Task task : tasks) {
            TaskResponse taskResponse = mapToTaskResponse(task);
            response.add(taskResponse);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable UUID id) {
        Optional<Task> taskOpt = taskMapper.findById(id);
        
        if (taskOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Task task = taskOpt.get();
        TaskResponse response = mapToTaskResponse(task);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<TaskResponse> createTask(@RequestBody CreateTaskRequest request) {
        Task task = new Task();
        task.setId(UUID.randomUUID());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(Task.TaskStatus.TODO);
        task.setPriority(Task.TaskPriority.fromValue(request.getPriority()));
        task.setAssigneeId(request.getAssigneeId());
        task.setProjectId(request.getProjectId());
        task.setCreatedBy(request.getCreatedBy());
        task.setDueDate(request.getDueDate());
        task.setEstimatedHours(BigDecimal.valueOf(request.getEstimatedHours()));
        task.setCreatedAt(OffsetDateTime.now());
        task.setUpdatedAt(OffsetDateTime.now());
        
        taskMapper.insert(task);
        
        // Insert subtasks if provided
        if (request.getSubtasks() != null) {
            for (CreateSubtaskRequest subtaskRequest : request.getSubtasks()) {
                Subtask subtask = new Subtask();
                subtask.setId(UUID.randomUUID());
                subtask.setTaskId(task.getId());
                subtask.setTitle(subtaskRequest.getTitle());
                subtask.setCompleted(false);
                subtask.setCreatedAt(OffsetDateTime.now());
                
                subtaskMapper.insert(subtask);
            }
        }
        
        // Insert tags if provided
        if (request.getTags() != null) {
            for (String tag : request.getTags()) {
                taskMapper.insertTag(UUID.randomUUID(), task.getId(), tag);
            }
        }
        
        // Fetch the created task with all relationships
        Optional<Task> createdTask = taskMapper.findById(task.getId());
        TaskResponse response = mapToTaskResponse(createdTask.get());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing task")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable UUID id, @RequestBody UpdateTaskRequest request) {
        Optional<Task> existingTaskOpt = taskMapper.findById(id);
        
        if (existingTaskOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Task task = existingTaskOpt.get();
        
        // Update fields if provided
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(Task.TaskStatus.fromValue(request.getStatus()));
        if (request.getPriority() != null) task.setPriority(Task.TaskPriority.fromValue(request.getPriority()));
        if (request.getAssigneeId() != null) task.setAssigneeId(request.getAssigneeId());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getEstimatedHours() != null) task.setEstimatedHours(BigDecimal.valueOf(request.getEstimatedHours()));
        if (request.getActualHours() != null) task.setActualHours(BigDecimal.valueOf(request.getActualHours()));
        
        taskMapper.update(task);
        
        // Update tags if provided
        if (request.getTags() != null) {
            taskMapper.deleteTagsByTaskId(id);
            for (String tag : request.getTags()) {
                taskMapper.insertTag(UUID.randomUUID(), id, tag);
            }
        }
        
        // Fetch the updated task
        Optional<Task> updatedTask = taskMapper.findById(id);
        TaskResponse response = mapToTaskResponse(updatedTask.get());
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        Optional<Task> taskOpt = taskMapper.findById(id);
        
        if (taskOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        taskMapper.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/dashboard/{projectId}")
    @Operation(summary = "Get dashboard statistics for a project")
    public ResponseEntity<DashboardStats> getDashboardStats(@PathVariable UUID projectId) {
        DashboardStats stats = taskMapper.getDashboardStats(projectId);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/team-members")
    @Operation(summary = "Get all team members")
    public ResponseEntity<List<TeamMemberResponse>> getTeamMembers() {
        List<User> users = userMapper.findAll();
        List<TeamMemberResponse> response = new ArrayList<>();
        
        for (User user : users) {
            TeamMemberResponse member = new TeamMemberResponse();
            member.setId(user.getId());
            member.setName(user.getName());
            member.setEmail(user.getEmail());
            member.setRole(user.getRole().name());
            response.add(member);
        }
        
        return ResponseEntity.ok(response);
    }
    
    private TaskResponse mapToTaskResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus().getValue());
        response.setPriority(task.getPriority().getValue());
        response.setAssigneeId(task.getAssigneeId());
        response.setAssigneeName(task.getAssigneeName());
        response.setProjectId(task.getProjectId());
        response.setCreatedBy(task.getCreatedBy());
        response.setCreatedByName(task.getCreatedByName());
        response.setDueDate(task.getDueDate());
        response.setEstimatedHours(task.getEstimatedHours().doubleValue());
        response.setActualHours(task.getActualHours() != null ? task.getActualHours().doubleValue() : null);
        response.setCreatedAt(task.getCreatedAt().toLocalDateTime());
        response.setUpdatedAt(task.getUpdatedAt().toLocalDateTime());
        
        // Load subtasks
        List<Subtask> subtasks = subtaskMapper.findByTaskId(task.getId());
        List<SubtaskResponse> subtaskResponses = new ArrayList<>();
        for (Subtask subtask : subtasks) {
            SubtaskResponse subtaskResponse = new SubtaskResponse();
            subtaskResponse.setId(subtask.getId());
            subtaskResponse.setTitle(subtask.getTitle());
            subtaskResponse.setCompleted(subtask.isCompleted());
            subtaskResponse.setDependsOn(subtaskMapper.findDependenciesBySubtaskId(subtask.getId()));
            subtaskResponses.add(subtaskResponse);
        }
        response.setSubtasks(subtaskResponses);
        
        // Load tags
        List<String> tags = taskMapper.findTagsByTaskId(task.getId());
        response.setTags(tags);
        
        // TODO: Load comments, attachments, reminders
        response.setComments(new ArrayList<>());
        response.setAttachments(new ArrayList<>());
        response.setReminders(new ArrayList<>());
        
        return response;
    }
}