package com.example.projectplanner.service;

import com.example.projectplanner.dto.ChatMessageRequest;
import com.example.projectplanner.dto.ChatMessageResponse;
import com.example.projectplanner.dto.SharedFileResponse;
import com.example.projectplanner.entity.ChatMessage;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.ChatMessageMapper;
import com.example.projectplanner.mapper.SharedFileMapper;
import com.example.projectplanner.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
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

    public ChatMessageResponse sendMessage(ChatMessageRequest request, String userEmail) {
        // Get the current user
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            throw new RuntimeException("User not found: " + userEmail);
        }

        // Create chat message entity
        ChatMessage message = new ChatMessage(
            request.getProjectId(),
            currentUser.getId(),
            request.getContent(),
            request.getType()
        );

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
}