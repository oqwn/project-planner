package com.example.projectplanner.service;

import com.example.projectplanner.dto.*;
import com.example.projectplanner.entity.ChatMessage;
import com.example.projectplanner.entity.MessageStatusTracker;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.ChatMessageMapper;
import com.example.projectplanner.mapper.SharedFileMapper;
import com.example.projectplanner.mapper.UserMapper;
import com.example.projectplanner.mapper.MessageStatusMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageMapper chatMessageMapper;

    @Autowired
    private SharedFileMapper sharedFileMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private FileIconService fileIconService;
    
    @Autowired
    private MessageStatusMapper messageStatusMapper;
    
    @Autowired
    private FileUploadService fileUploadService;

    public ChatMessageResponse sendMessage(ChatMessageRequest request, String userEmail) {
        // Get the current user
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            throw new RuntimeException("User not found: " + userEmail);
        }

        // Create chat message entity
        ChatMessage message = new ChatMessage(
            request.getConversationId(),
            currentUser.getId(),
            request.getContent(),
            request.getType()
        );
        
        // Set project ID for backward compatibility if provided
        message.setProjectId(request.getProjectId());
        
        // Set client message ID if provided
        if (request.getClientMessageId() != null) {
            message.setClientMessageId(request.getClientMessageId());
        }

        message.setReplyToMessageId(request.getReplyToMessageId());
        message.setMentions(request.getMentions());
        message.setAttachmentIds(request.getAttachmentIds());

        // Save the message
        chatMessageMapper.insert(message);

        // Retrieve the saved message with user details
        ChatMessageResponse response = chatMessageMapper.findById(message.getId());
        
        // Set flag for own message
        response.setOwnMessage(true);

        // Load attachments if any
        if (request.getAttachmentIds() != null && !request.getAttachmentIds().isEmpty()) {
            UUID[] attachmentArray = request.getAttachmentIds().toArray(new UUID[0]);
            List<SharedFileResponse> attachments = sharedFileMapper.findByIds(attachmentArray);
            
            // Set file icons
            attachments.forEach(file -> 
                file.setFileIcon(fileIconService.getIconForFileType(file.getFileType()))
            );
            
            response.setAttachments(attachments);
        }

        return response;
    }

    public List<ChatMessageResponse> getProjectMessages(UUID projectId, int page, int size, String userEmail) {
        // Get current user for own message flagging
        User currentUser = userMapper.findByEmail(userEmail);
        
        int offset = page * size;
        List<ChatMessageResponse> messages = chatMessageMapper.findByProjectId(projectId, size, offset);
        
        // Set own message flags and load attachments
        return messages.stream().map(message -> {
            message.setOwnMessage(currentUser != null && currentUser.getId().equals(message.getSenderId()));
            
            // Load attachments for messages that have them
            // This would require additional logic to get attachment IDs from the message
            // For now, we'll leave attachments empty in the list view for performance
            
            return message;
        }).collect(Collectors.toList());
    }

    public List<ChatMessageResponse> getConversationMessages(UUID conversationId, int page, int size, String userEmail) {
        // Get current user for own message flagging
        User currentUser = userMapper.findByEmail(userEmail);
        
        int offset = page * size;
        List<ChatMessageResponse> messages = chatMessageMapper.findByConversationId(conversationId, size, offset);
        
        // Set own message flags and load attachments
        return messages.stream().map(message -> {
            message.setOwnMessage(currentUser != null && currentUser.getId().equals(message.getSenderId()));
            
            // Load attachments for messages that have them
            // This would require additional logic to get attachment IDs from the message
            // For now, we'll leave attachments empty in the list view for performance
            
            return message;
        }).collect(Collectors.toList());
    }

    public void deleteMessage(UUID messageId, String userEmail) {
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            throw new RuntimeException("User not found: " + userEmail);
        }

        // Get the message to check ownership
        ChatMessageResponse message = chatMessageMapper.findById(messageId);
        if (message == null) {
            throw new RuntimeException("Message not found");
        }

        // Only allow deletion of own messages or by admin
        if (!currentUser.getId().equals(message.getSenderId()) && !"ADMIN".equals(currentUser.getRole())) {
            throw new RuntimeException("Not authorized to delete this message");
        }

        chatMessageMapper.softDelete(messageId, OffsetDateTime.now());
    }

    public long getMessageCount(UUID projectId) {
        return chatMessageMapper.countByProjectId(projectId);
    }
    
    public ChatMessageResponse sendConversationMessage(ChatMessageRequest request, String userEmail) {
        System.out.println("=== ChatService.sendConversationMessage ===");
        System.out.println("User: " + userEmail);
        System.out.println("ConversationId: " + request.getConversationId());
        System.out.println("ProjectId: " + request.getProjectId());
        System.out.println("Content: " + request.getContent());
        System.out.println("ClientMessageId: " + request.getClientMessageId());
        
        // Get the current user
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            throw new RuntimeException("User not found: " + userEmail);
        }

        // Create chat message entity
        ChatMessage message = new ChatMessage(
            request.getConversationId(),
            currentUser.getId(),
            request.getContent(),
            request.getType()
        );
        
        // Set project ID from request
        message.setProjectId(request.getProjectId());
        
        // Set client message ID if provided
        if (request.getClientMessageId() != null) {
            message.setClientMessageId(request.getClientMessageId());
        }
        
        message.setReplyToMessageId(request.getReplyToMessageId());
        message.setMentions(request.getMentions());
        message.setAttachmentIds(request.getAttachmentIds());

        // Save the message
        System.out.println("Message status before insert: " + message.getStatus());
        System.out.println("Message client ID: " + message.getClientMessageId());
        System.out.println("Message ID: " + message.getId());
        System.out.println("Conversation ID: " + message.getConversationId());
        System.out.println("Sender ID: " + message.getSenderId());
        System.out.println("Content: " + message.getContent());
        System.out.println("Type: " + message.getType());
        System.out.println("Mentions: " + message.getMentions());
        System.out.println("Attachments: " + message.getAttachmentIds());
        try {
            chatMessageMapper.insert(message);
            System.out.println("Message inserted with ID: " + message.getId());
        } catch (Exception e) {
            System.err.println("Error inserting message: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to insert message", e);
        }

        // Retrieve the saved message with user details
        ChatMessageResponse response = chatMessageMapper.findById(message.getId());
        
        if (response == null) {
            throw new RuntimeException("Failed to retrieve saved message");
        }
        
        // Set flag for own message
        response.setOwnMessage(true);

        // Load attachments if any
        if (request.getAttachmentIds() != null && !request.getAttachmentIds().isEmpty()) {
            UUID[] attachmentArray = request.getAttachmentIds().toArray(new UUID[0]);
            List<SharedFileResponse> attachments = sharedFileMapper.findByIds(attachmentArray);
            
            // Set file icons
            attachments.forEach(file -> 
                file.setFileIcon(fileIconService.getIconForFileType(file.getFileType()))
            );
            
            response.setAttachments(attachments);
        }

        System.out.println("Message response created: " + response.getId());
        return response;
    }
    
    // New methods for HTTP-based messaging
    public Page<ChatMessageResponse> getConversationMessages(UUID conversationId, String before, String after, 
            Pageable pageable, String userEmail) {
        User currentUser = userMapper.findByEmail(userEmail);
        
        // Implementation would fetch messages with pagination
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<ChatMessageResponse> messages = chatMessageMapper.findByConversationId(
            conversationId, pageable.getPageSize(), offset
        );
        
        // Mark messages as delivered for current user
        if (currentUser != null) {
            List<String> messageIds = messages.stream()
                .filter(m -> !m.getSenderId().equals(currentUser.getId()))
                .map(m -> m.getId().toString())
                .collect(Collectors.toList());
            
            if (!messageIds.isEmpty()) {
                markMessagesDelivered(messageIds, userEmail);
            }
        }
        
        return new PageImpl<>(messages, pageable, chatMessageMapper.countByConversationId(conversationId));
    }
    
    public void markMessagesDelivered(List<String> messageIds, String userEmail) {
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) return;
        
        for (String messageId : messageIds) {
            messageStatusMapper.markDelivered(UUID.fromString(messageId), currentUser.getId());
        }
    }
    
    public void markMessagesRead(List<String> messageIds, String userEmail) {
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) return;
        
        for (String messageId : messageIds) {
            messageStatusMapper.markRead(UUID.fromString(messageId), currentUser.getId());
        }
    }
    
    public List<ChatMessageResponse> getUndeliveredMessages(String userEmail) {
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            return List.of();
        }
        
        return chatMessageMapper.findUndeliveredForUser(currentUser.getId());
    }
    
    public ChatMessageResponse retryMessage(String messageId, String userEmail) {
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            throw new RuntimeException("User not found");
        }
        
        // Get the failed message
        ChatMessageResponse originalMessage = chatMessageMapper.findById(UUID.fromString(messageId));
        if (originalMessage == null || !originalMessage.getSenderId().equals(currentUser.getId())) {
            throw new RuntimeException("Message not found or unauthorized");
        }
        
        // Update status to SENT
        chatMessageMapper.updateStatus(UUID.fromString(messageId), ChatMessage.MessageStatus.SENT);
        
        return chatMessageMapper.findById(UUID.fromString(messageId));
    }
    
    public MediaUploadResponse uploadMedia(UUID conversationId, MultipartFile file, String caption, String userEmail) {
        try {
            User currentUser = userMapper.findByEmail(userEmail);
            if (currentUser == null) {
                throw new RuntimeException("User not found");
            }
            
            // Upload file
            SharedFileResponse uploadedFile = fileUploadService.uploadFile(file, conversationId, currentUser.getId());
            
            // Create message with file attachment
            ChatMessageRequest messageRequest = new ChatMessageRequest();
            messageRequest.setConversationId(conversationId);
            messageRequest.setContent(caption != null ? caption : file.getOriginalFilename());
            messageRequest.setType(ChatMessage.MessageType.FILE);
            messageRequest.setAttachmentIds(List.of(uploadedFile.getId()));
            
            ChatMessageResponse message = sendConversationMessage(messageRequest, userEmail);
            
            return new MediaUploadResponse(
                message.getId().toString(),
                uploadedFile.getFileUrl(),
                "success",
                null
            );
            
        } catch (Exception e) {
            return new MediaUploadResponse(null, null, "failed", e.getMessage());
        }
    }
}