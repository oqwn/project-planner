package com.example.projectplanner.controller;

import com.example.projectplanner.dto.ConversationResponse;
import com.example.projectplanner.dto.CreateConversationRequest;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.UserMapper;
import com.example.projectplanner.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private UserMapper userMapper;

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getUserConversations(
            @AuthenticationPrincipal String userEmail) {
        
        List<ConversationResponse> conversations = conversationService.getUserConversations(userEmail);
        return ResponseEntity.ok(conversations);
    }

    @PostMapping
    public ResponseEntity<ConversationResponse> createConversation(
            @RequestBody CreateConversationRequest request,
            @AuthenticationPrincipal String userEmail) {
        
        ConversationResponse conversation = conversationService.createConversation(request, userEmail);
        return ResponseEntity.ok(conversation);
    }

    @PostMapping("/direct-message/{userId}")
    public ResponseEntity<ConversationResponse> getOrCreateDirectMessage(
            @PathVariable UUID userId,
            @AuthenticationPrincipal String userEmail) {
        
        // Get current user ID from email
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            throw new RuntimeException("User not found");
        }
        
        ConversationResponse conversation = conversationService.getOrCreateDirectMessage(currentUser.getId(), userId);
        return ResponseEntity.ok(conversation);
    }

    @PostMapping("/{conversationId}/mark-read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable UUID conversationId,
            @AuthenticationPrincipal String userEmail) {
        
        conversationService.markAsRead(conversationId, userEmail);
        return ResponseEntity.ok().build();
    }
}