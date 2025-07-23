package com.example.projectplanner.service;

import com.example.projectplanner.entity.Meeting;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.MeetingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class MeetingService {
    
    @Autowired
    private MeetingMapper meetingMapper;
    
    public Meeting createMeeting(Meeting meeting, User currentUser) {
        meeting.setId(UUID.randomUUID().toString());
        meeting.setHostId(currentUser.getId().toString());
        meeting.setHostName(currentUser.getName());
        meeting.setCode(generateMeetingCode());
        meeting.setStatus(Meeting.MeetingStatus.SCHEDULED);
        meeting.setStartTime(new Date());
        meeting.setCreatedAt(new Date());
        meeting.setUpdatedAt(new Date());
        
        if (meeting.getDuration() == null) {
            meeting.setDuration(60); // Default 60 minutes
        }
        
        meetingMapper.insert(meeting);
        return meeting;
    }
    
    public Meeting getMeetingById(String id) {
        return meetingMapper.findById(id);
    }
    
    public Meeting getMeetingByCode(String code) {
        return meetingMapper.findByCode(code);
    }
    
    public List<Meeting> getMeetingsByProjectId(String projectId) {
        return meetingMapper.findByProjectId(projectId);
    }
    
    public List<Meeting> getMeetingsByHostId(String userId) {
        return meetingMapper.findByHostId(userId);
    }
    
    public Meeting startMeeting(String meetingId) {
        Meeting meeting = meetingMapper.findById(meetingId);
        if (meeting != null) {
            meetingMapper.updateStatus(meetingId, Meeting.MeetingStatus.ACTIVE.getValue());
            meeting.setStatus(Meeting.MeetingStatus.ACTIVE);
        }
        return meeting;
    }
    
    public Meeting endMeeting(String meetingId) {
        Meeting meeting = meetingMapper.findById(meetingId);
        if (meeting != null) {
            meetingMapper.updateStatus(meetingId, Meeting.MeetingStatus.ENDED.getValue());
            meeting.setStatus(Meeting.MeetingStatus.ENDED);
        }
        return meeting;
    }
    
    public void deleteMeeting(String meetingId) {
        meetingMapper.delete(meetingId);
    }
    
    private String generateMeetingCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        
        for (int i = 0; i < 6; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
        
        // Check if code already exists
        Meeting existing = meetingMapper.findByCode(code.toString());
        if (existing != null) {
            return generateMeetingCode(); // Recursively generate new code
        }
        
        return code.toString();
    }
}