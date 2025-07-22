package com.example.projectplanner.controller;

import com.example.projectplanner.dto.*;
import com.example.projectplanner.service.ChatService;
import com.example.projectplanner.entity.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Send message via HTTP with delivery confirmation
    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<MessageDeliveryResponse> sendMessage(
            @PathVariable UUID conversationId,
            @RequestBody ChatMessageRequest request,
            @AuthenticationPrincipal String userEmail) {
        
        try {
            // Set conversation ID from path
            request.setConversationId(conversationId);
            
            // Generate client message ID if not provided
            String clientMessageId = request.getClientMessageId();
            if (clientMessageId == null) {
                clientMessageId = UUID.randomUUID().toString();
                request.setClientMessageId(clientMessageId);
            }
            
            // Send message and get response
            ChatMessageResponse message = chatService.sendConversationMessage(request, userEmail);
            
            // Broadcast via WebSocket for real-time delivery
            CompletableFuture.runAsync(() -> {
                messagingTemplate.convertAndSend(
                    "/topic/conversation/" + conversationId + "/messages", 
                    message
                );
                
                // Also send to user's personal topic
                messagingTemplate.convertAndSend(
                    "/topic/user/" + userEmail + "/messages",
                    message
                );
            });
            
            // Return delivery confirmation
            MessageDeliveryResponse deliveryResponse = new MessageDeliveryResponse();
            deliveryResponse.setMessageId(message.getId().toString());
            deliveryResponse.setClientMessageId(clientMessageId);
            deliveryResponse.setStatus("sent");
            deliveryResponse.setTimestamp(message.getTimestamp().toLocalDateTime());
            
            return ResponseEntity.ok(deliveryResponse);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageDeliveryResponse(null, request.getClientMessageId(), "failed", e.getMessage()));
        }
    }
    
    // Get message history with pagination
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getMessages(
            @PathVariable UUID conversationId,
            @RequestParam(required = false) String before,
            @RequestParam(required = false) String after,
            Pageable pageable,
            @AuthenticationPrincipal String userEmail) {
        
        Page<ChatMessageResponse> messages = chatService.getConversationMessages(
            conversationId, before, after, pageable, userEmail
        );
        
        return ResponseEntity.ok(messages);
    }
    
    // Mark messages as delivered
    @PostMapping("/messages/delivered")
    public ResponseEntity<Void> markMessagesDelivered(
            @RequestBody MessageStatusUpdateRequest request,
            @AuthenticationPrincipal String userEmail) {
        
        chatService.markMessagesDelivered(request.getMessageIds(), userEmail);
        
        // Notify sender via WebSocket
        CompletableFuture.runAsync(() -> {
            for (String messageId : request.getMessageIds()) {
                messagingTemplate.convertAndSend(
                    "/topic/message-status/" + messageId,
                    Map.of("messageId", messageId, "status", "delivered", "userId", userEmail)
                );
            }
        });
        
        return ResponseEntity.ok().build();
    }
    
    // Mark messages as read
    @PostMapping("/messages/read")
    public ResponseEntity<Void> markMessagesRead(
            @RequestBody MessageStatusUpdateRequest request,
            @AuthenticationPrincipal String userEmail) {
        
        chatService.markMessagesRead(request.getMessageIds(), userEmail);
        
        // Notify sender via WebSocket
        CompletableFuture.runAsync(() -> {
            for (String messageId : request.getMessageIds()) {
                messagingTemplate.convertAndSend(
                    "/topic/message-status/" + messageId,
                    Map.of("messageId", messageId, "status", "read", "userId", userEmail)
                );
            }
        });
        
        return ResponseEntity.ok().build();
    }
    
    // Upload media/files
    @PostMapping("/conversations/{conversationId}/media")
    public ResponseEntity<MediaUploadResponse> uploadMedia(
            @PathVariable UUID conversationId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String caption,
            @AuthenticationPrincipal String userEmail) {
        
        try {
            MediaUploadResponse response = chatService.uploadMedia(
                conversationId, file, caption, userEmail
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MediaUploadResponse(null, null, "failed", e.getMessage()));
        }
    }
    
    // Typing indicator
    @PostMapping("/conversations/{conversationId}/typing")
    public ResponseEntity<Void> sendTypingIndicator(
            @PathVariable UUID conversationId,
            @RequestBody TypingIndicatorRequest request,
            @AuthenticationPrincipal String userEmail) {
        
        // Broadcast typing status via WebSocket only
        messagingTemplate.convertAndSend(
            "/topic/conversation/" + conversationId + "/typing",
            Map.of(
                "userId", userEmail,
                "isTyping", request.isTyping(),
                "timestamp", System.currentTimeMillis()
            )
        );
        
        return ResponseEntity.ok().build();
    }
    
    // Get undelivered messages (for offline sync)
    @GetMapping("/messages/undelivered")
    public ResponseEntity<List<ChatMessageResponse>> getUndeliveredMessages(
            @AuthenticationPrincipal String userEmail) {
        
        List<ChatMessageResponse> messages = chatService.getUndeliveredMessages(userEmail);
        return ResponseEntity.ok(messages);
    }
    
    // Retry failed message
    @PostMapping("/messages/{messageId}/retry")
    public ResponseEntity<MessageDeliveryResponse> retryMessage(
            @PathVariable String messageId,
            @AuthenticationPrincipal String userEmail) {
        
        try {
            ChatMessageResponse message = chatService.retryMessage(messageId, userEmail);
            
            // Broadcast via WebSocket
            CompletableFuture.runAsync(() -> {
                messagingTemplate.convertAndSend(
                    "/topic/conversation/" + message.getConversationId() + "/messages", 
                    message
                );
            });
            
            MessageDeliveryResponse response = new MessageDeliveryResponse();
            response.setMessageId(message.getId().toString());
            response.setStatus("sent");
            response.setTimestamp(message.getTimestamp().toLocalDateTime());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageDeliveryResponse(messageId, null, "failed", e.getMessage()));
        }
    }
}