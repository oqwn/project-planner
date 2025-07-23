package com.example.projectplanner.controller;

import com.example.projectplanner.entity.Meeting;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.UserMapper;
import com.example.projectplanner.service.JwtService;
import com.example.projectplanner.service.MeetingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MeetingControllerTest {

    @Mock
    private MeetingService meetingService;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserMapper userMapper;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private MeetingController meetingController;

    private User testUser;
    private Meeting testMeeting;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("test@example.com");
        testUser.setName("Test User");

        testMeeting = new Meeting();
        testMeeting.setId("meeting-123");
        testMeeting.setTitle("Test Meeting");
        testMeeting.setCode("ABC123");
        testMeeting.setHostId(testUser.getId().toString());
        testMeeting.setHostName(testUser.getName());
    }

    @Test
    void testGetMeetingsByProject() {
        // Arrange
        String projectId = "550e8400-e29b-41d4-a716-446655440001";
        List<Meeting> meetings = Arrays.asList(testMeeting);
        when(meetingService.getMeetingsByProjectId(projectId)).thenReturn(meetings);

        // Act
        ResponseEntity<List<Meeting>> response = meetingController.getMeetingsByProject(projectId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Test Meeting", response.getBody().get(0).getTitle());
    }

    @Test
    void testCreateMeeting() {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn("Bearer test-token");
        when(jwtService.extractUsername("test-token")).thenReturn("test@example.com");
        when(userMapper.findByEmail("test@example.com")).thenReturn(testUser);
        when(meetingService.createMeeting(any(Meeting.class), eq(testUser))).thenReturn(testMeeting);

        Meeting newMeeting = new Meeting();
        newMeeting.setTitle("New Meeting");

        // Act
        ResponseEntity<Meeting> response = meetingController.createMeeting(newMeeting, request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Test Meeting", response.getBody().getTitle());
    }

    @Test
    void testCreateMeetingUnauthorized() {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn(null);

        Meeting newMeeting = new Meeting();
        newMeeting.setTitle("New Meeting");

        // Act
        ResponseEntity<Meeting> response = meetingController.createMeeting(newMeeting, request);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}