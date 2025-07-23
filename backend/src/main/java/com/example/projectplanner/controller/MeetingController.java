package com.example.projectplanner.controller;

import com.example.projectplanner.entity.Meeting;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.service.MeetingService;
import com.example.projectplanner.service.JwtService;
import com.example.projectplanner.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MeetingController {
    
    @Autowired
    private MeetingService meetingService;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserMapper userMapper;
    
    @PostMapping
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting, HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            return ResponseEntity.status(401).build();
        }
        
        String email = jwtService.extractUsername(token);
        User currentUser = userMapper.findByEmail(email);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        
        Meeting createdMeeting = meetingService.createMeeting(meeting, currentUser);
        return ResponseEntity.ok(createdMeeting);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Meeting> getMeeting(@PathVariable String id) {
        Meeting meeting = meetingService.getMeetingById(id);
        if (meeting == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(meeting);
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<Meeting> getMeetingByCode(@PathVariable String code) {
        Meeting meeting = meetingService.getMeetingByCode(code);
        if (meeting == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(meeting);
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Meeting>> getMeetingsByProject(@PathVariable String projectId) {
        List<Meeting> meetings = meetingService.getMeetingsByProjectId(projectId);
        return ResponseEntity.ok(meetings);
    }
    
    @GetMapping("/user/hosted")
    public ResponseEntity<List<Meeting>> getHostedMeetings(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtService.extractUsername(token);
        User currentUser = userMapper.findByEmail(email);
        
        List<Meeting> meetings = meetingService.getMeetingsByHostId(currentUser.getId().toString());
        return ResponseEntity.ok(meetings);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
    
    @PostMapping("/{id}/start")
    public ResponseEntity<Meeting> startMeeting(@PathVariable String id, HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtService.extractUsername(token);
        User currentUser = userMapper.findByEmail(email);
        
        Meeting meeting = meetingService.getMeetingById(id);
        if (meeting == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Only host can start the meeting
        if (!meeting.getHostId().equals(currentUser.getId().toString())) {
            return ResponseEntity.status(403).build();
        }
        
        Meeting updatedMeeting = meetingService.startMeeting(id);
        return ResponseEntity.ok(updatedMeeting);
    }
    
    @PostMapping("/{id}/end")
    public ResponseEntity<Meeting> endMeeting(@PathVariable String id, HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtService.extractUsername(token);
        User currentUser = userMapper.findByEmail(email);
        
        Meeting meeting = meetingService.getMeetingById(id);
        if (meeting == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Only host can end the meeting
        if (!meeting.getHostId().equals(currentUser.getId().toString())) {
            return ResponseEntity.status(403).build();
        }
        
        Meeting updatedMeeting = meetingService.endMeeting(id);
        return ResponseEntity.ok(updatedMeeting);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteMeeting(@PathVariable String id, HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtService.extractUsername(token);
        User currentUser = userMapper.findByEmail(email);
        
        Meeting meeting = meetingService.getMeetingById(id);
        if (meeting == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Only host can delete the meeting
        if (!meeting.getHostId().equals(currentUser.getId().toString())) {
            return ResponseEntity.status(403).build();
        }
        
        // Cannot delete meetings that have ended
        if (meeting.getStatus() == Meeting.MeetingStatus.ENDED) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Cannot delete meetings that have ended");
            return ResponseEntity.status(400).body(error);
        }
        
        meetingService.deleteMeeting(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Meeting deleted successfully");
        return ResponseEntity.ok(response);
    }
}