package com.example.projectplanner.controller;

import com.example.projectplanner.dto.ChatMessageRequest;
import com.example.projectplanner.dto.ChatMessageResponse;
import com.example.projectplanner.dto.ConversationResponse;
import com.example.projectplanner.dto.CreateConversationRequest;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.UserMapper;
import com.example.projectplanner.service.ChatService;
import com.example.projectplanner.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/project/{projectId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getProjectMessages(
            @PathVariable UUID projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal String userEmail) {
        
        List<ChatMessageResponse> messages = chatService.getProjectMessages(projectId, page, size, userEmail);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getConversationMessages(
            @PathVariable UUID conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal String userEmail) {
        
        List<ChatMessageResponse> messages = chatService.getConversationMessages(conversationId, page, size, userEmail);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @RequestBody ChatMessageRequest request,
            @AuthenticationPrincipal String userEmail) {
        
        ChatMessageResponse response = chatService.sendMessage(request, userEmail);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable UUID messageId,
            @AuthenticationPrincipal String userEmail) {
        
        chatService.deleteMessage(messageId, userEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/project/{projectId}/messages/count")
    public ResponseEntity<Long> getMessageCount(@PathVariable UUID projectId) {
        long count = chatService.getMessageCount(projectId);
        return ResponseEntity.ok(count);
    }

    // Conversation endpoints
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getUserConversations(
            @AuthenticationPrincipal String userEmail) {
        
        List<ConversationResponse> conversations = conversationService.getUserConversations(userEmail);
        return ResponseEntity.ok(conversations);
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationResponse> createConversation(
            @RequestBody CreateConversationRequest request,
            @AuthenticationPrincipal String userEmail) {
        
        ConversationResponse response = conversationService.createConversation(request, userEmail);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/conversations/dm/{userId}")
    public ResponseEntity<ConversationResponse> getOrCreateDirectMessage(
            @PathVariable UUID userId,
            @AuthenticationPrincipal String userEmail) {
        
        // Get current user ID
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            return ResponseEntity.badRequest().build();
        }
        
        ConversationResponse response = conversationService.getOrCreateDirectMessage(currentUser.getId(), userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markConversationAsRead(
            @PathVariable UUID conversationId,
            @AuthenticationPrincipal String userEmail) {
        
        conversationService.markAsRead(conversationId, userEmail);
        return ResponseEntity.ok().build();
    }
}