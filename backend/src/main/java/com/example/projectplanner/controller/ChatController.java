package com.example.projectplanner.controller;

import com.example.projectplanner.dto.ChatMessageRequest;
import com.example.projectplanner.dto.ChatMessageResponse;
import com.example.projectplanner.service.ChatService;
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

    @GetMapping("/project/{projectId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getProjectMessages(
            @PathVariable UUID projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal String userEmail) {
        
        List<ChatMessageResponse> messages = chatService.getProjectMessages(projectId, page, size, userEmail);
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
}