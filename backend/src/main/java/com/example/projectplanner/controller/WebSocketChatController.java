package com.example.projectplanner.controller;

import com.example.projectplanner.dto.ChatMessageRequest;
import com.example.projectplanner.dto.ChatMessageResponse;
import com.example.projectplanner.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
public class WebSocketChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

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
}