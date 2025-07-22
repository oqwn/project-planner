package com.example.projectplanner.controller;

import com.example.projectplanner.dto.ChatMessageRequest;
import com.example.projectplanner.dto.ChatMessageResponse;
import com.example.projectplanner.service.ChatService;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;
import java.util.Map;
import java.util.List;

@Controller
public class WebSocketChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private UserMapper userMapper;

    @MessageMapping("/chat.sendMessage/{projectId}")
    public void sendMessage(
            @DestinationVariable UUID projectId,
            @Payload ChatMessageRequest chatMessage,
            SimpMessageHeaderAccessor headerAccessor,
            Principal principal) {

        try {
            // Get the authenticated user email from the principal
            String userEmail = principal.getName();
            
            // Set project ID from the path variable
            chatMessage.setProjectId(projectId);
            
            // Save message and get response with user details
            ChatMessageResponse response = chatService.sendMessage(chatMessage, userEmail);
            
            // Send to all subscribers of the project chat
            messagingTemplate.convertAndSend(
                "/topic/project/" + projectId + "/messages", 
                response
            );
            
        } catch (Exception e) {
            // Send error message back to sender
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/errors",
                "Failed to send message: " + e.getMessage()
            );
        }
    }

    @MessageMapping("/chat.addUser/{projectId}")
    public void addUser(
            @DestinationVariable UUID projectId,
            SimpMessageHeaderAccessor headerAccessor,
            Principal principal) {

        try {
            String userEmail = principal.getName();
            
            // Add username to websocket session
            headerAccessor.getSessionAttributes().put("username", userEmail);
            headerAccessor.getSessionAttributes().put("projectId", projectId.toString());
            
            // Create system message for user joining
            ChatMessageRequest joinMessage = new ChatMessageRequest();
            joinMessage.setProjectId(projectId);
            joinMessage.setContent(userEmail + " joined the chat");
            joinMessage.setType(com.example.projectplanner.entity.ChatMessage.MessageType.SYSTEM);
            
            ChatMessageResponse response = chatService.sendMessage(joinMessage, userEmail);
            
            // Broadcast user joining to all project subscribers
            messagingTemplate.convertAndSend(
                "/topic/project/" + projectId + "/messages", 
                response
            );
            
        } catch (Exception e) {
            System.err.println("Error adding user to chat: " + e.getMessage());
        }
    }

    // ===== CONVERSATION-BASED WEBSOCKET ENDPOINTS =====
    
    @MessageMapping("/chat.send")
    public void sendConversationMessage(
            @Payload Map<String, Object> messageData,
            Principal principal) {
        
        System.out.println("=== Conversation Message WebSocket Endpoint ===");
        System.out.println("From user: " + principal.getName());
        System.out.println("Message data: " + messageData);
        
        try {
            String userEmail = principal.getName();
            String conversationId = (String) messageData.get("conversationId");
            String content = (String) messageData.get("content");
            String type = (String) messageData.get("type");
            @SuppressWarnings("unchecked")
            List<String> mentions = (List<String>) messageData.get("mentions");
            
            if (conversationId == null || content == null) {
                throw new IllegalArgumentException("Missing required fields: conversationId or content");
            }
            
            // Create ChatMessageRequest for conversation message
            ChatMessageRequest chatMessage = new ChatMessageRequest();
            chatMessage.setConversationId(UUID.fromString(conversationId));
            chatMessage.setContent(content);
            chatMessage.setType(com.example.projectplanner.entity.ChatMessage.MessageType.TEXT);
            chatMessage.setMentions(mentions);
            
            // Save message using chat service
            ChatMessageResponse response = chatService.sendConversationMessage(chatMessage, userEmail);
            
            // Send message to all conversation participants
            messagingTemplate.convertAndSend(
                "/topic/conversation/" + conversationId + "/messages", 
                response
            );
            
            // Also send to each user's personal message topic
            // This allows users to receive messages even when not subscribed to specific conversation
            User currentUser = userMapper.findByEmail(userEmail);
            if (currentUser != null) {
                messagingTemplate.convertAndSend(
                    "/topic/user/" + userEmail + "/messages",
                    response
                );
            }
            
            System.out.println("Message sent successfully to conversation: " + conversationId);
            
        } catch (Exception e) {
            System.err.println("Error sending conversation message: " + e.getMessage());
            e.printStackTrace();
            
            // Send error message back to sender
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/errors",
                "Failed to send message: " + e.getMessage()
            );
        }
    }
    
    @MessageMapping("/presence")
    public void updatePresence(
            @Payload Map<String, Object> presenceData,
            Principal principal) {
        
        try {
            String userEmail = principal.getName();
            Boolean isOnline = (Boolean) presenceData.get("isOnline");
            
            System.out.println("Presence update: " + userEmail + " is " + (isOnline ? "online" : "offline"));
            
            // Broadcast presence update to all users
            Map<String, Object> presenceUpdate = Map.of(
                "userId", userEmail,
                "isOnline", isOnline != null ? isOnline : true
            );
            
            messagingTemplate.convertAndSend("/topic/presence", presenceUpdate);
            
        } catch (Exception e) {
            System.err.println("Error updating presence: " + e.getMessage());
        }
    }
}