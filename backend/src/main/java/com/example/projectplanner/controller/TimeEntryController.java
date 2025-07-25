package com.example.projectplanner.controller;

import com.example.projectplanner.dto.CreateTimeEntryRequest;
import com.example.projectplanner.dto.TimeEntryResponse;
import com.example.projectplanner.entity.TimeEntry;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.TimeEntryMapper;
import com.example.projectplanner.mapper.TaskMapper;
import com.example.projectplanner.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/time-entries")
public class TimeEntryController {
    
    // Force reload

    @Autowired
    private TimeEntryMapper timeEntryMapper;

    @Autowired
    private TaskMapper taskMapper;

    @Autowired
    private UserMapper userMapper;

    @PostMapping
    public ResponseEntity<TimeEntryResponse> createTimeEntry(
            @RequestBody CreateTimeEntryRequest request,
            @AuthenticationPrincipal String userEmail) {
        
        // Get current user
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Verify task exists
        if (!taskMapper.existsById(request.getTaskId())) {
            return ResponseEntity.notFound().build();
        }

        // Create time entry
        TimeEntry timeEntry = new TimeEntry(
            request.getTaskId(),
            currentUser.getId(),
            request.getDate(),
            request.getHours(),
            request.getDescription()
        );

        timeEntryMapper.insert(timeEntry);
        TimeEntryResponse response = timeEntryMapper.findById(timeEntry.getId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TimeEntryResponse>> getProjectTimeEntries(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal String userEmail) {
        
        List<TimeEntryResponse> entries = timeEntryMapper.findByProjectId(projectId);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TimeEntryResponse>> getUserTimeEntries(
            @PathVariable UUID userId,
            @AuthenticationPrincipal String userEmail) {
        
        // Get current user
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Users can only view their own time entries unless they're an admin
        if (!currentUser.getId().equals(userId) && !currentUser.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<TimeEntryResponse> entries = timeEntryMapper.findByUserId(userId);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/my-entries")
    public ResponseEntity<List<TimeEntryResponse>> getMyTimeEntries(
            @AuthenticationPrincipal String userEmail) {
        
        // Get current user
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<TimeEntryResponse> entries = timeEntryMapper.findByUserId(currentUser.getId());
        return ResponseEntity.ok(entries);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeEntry(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userEmail) {
        
        // Get current user
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Check if entry exists and belongs to the user
        if (!timeEntryMapper.existsByIdAndUserId(id, currentUser.getId())) {
            return ResponseEntity.notFound().build();
        }

        timeEntryMapper.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}