package com.example.projectplanner.service;

import com.example.projectplanner.dto.ConversationParticipantResponse;
import com.example.projectplanner.dto.ConversationResponse;
import com.example.projectplanner.dto.CreateConversationRequest;
import com.example.projectplanner.entity.Conversation;
import com.example.projectplanner.entity.ConversationParticipant;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.ConversationMapper;
import com.example.projectplanner.mapper.ConversationParticipantMapper;
import com.example.projectplanner.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ConversationService {

    @Autowired
    private ConversationMapper conversationMapper;

    @Autowired
    private ConversationParticipantMapper participantMapper;

    @Autowired
    private UserMapper userMapper;

    public List<ConversationResponse> getUserConversations(String userEmail) {
        // Find user by email
        User user = userMapper.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        List<Conversation> conversations = conversationMapper.findByUserId(user.getId());
        
        return conversations.stream()
            .map(conversation -> convertToResponse(conversation, user.getId()))
            .collect(Collectors.toList());
    }

    @Transactional
    public ConversationResponse createConversation(CreateConversationRequest request, String creatorEmail) {
        // Find creator by email
        User creator = userMapper.findByEmail(creatorEmail);
        if (creator == null) {
            throw new RuntimeException("Creator not found");
        }

        // For direct messages, check if conversation already exists
        if (request.getType() == Conversation.ConversationType.DIRECT_MESSAGE && 
            request.getParticipantIds().size() == 1) {
            
            UUID otherUserId = request.getParticipantIds().get(0);
            Conversation existing = conversationMapper.findDirectMessageBetweenUsers(creator.getId(), otherUserId);
            
            if (existing != null) {
                return convertToResponse(existing, creator.getId());
            }
        }

        // Create new conversation
        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setName(request.getName());
        conversation.setType(request.getType());
        conversation.setProjectId(request.getProjectId());
        conversation.setCreatedBy(creator.getId());
        conversation.setCreatedAt(OffsetDateTime.now());
        conversation.setUpdatedAt(OffsetDateTime.now());

        conversationMapper.insert(conversation);

        // Add creator as participant
        addParticipant(conversation.getId(), creator.getId());

        // Add other participants
        for (UUID participantId : request.getParticipantIds()) {
            if (!participantId.equals(creator.getId())) {
                addParticipant(conversation.getId(), participantId);
            }
        }

        return convertToResponse(conversation, creator.getId());
    }

    @Transactional
    public ConversationResponse getOrCreateDirectMessage(UUID currentUserId, UUID otherUserId) {
        // Check if DM already exists
        Conversation existing = conversationMapper.findDirectMessageBetweenUsers(currentUserId, otherUserId);
        
        if (existing != null) {
            return convertToResponse(existing, currentUserId);
        }

        // Create new DM
        User otherUser = userMapper.findById(otherUserId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setName("Direct Message"); // Will be shown as other user's name in UI
        conversation.setType(Conversation.ConversationType.DIRECT_MESSAGE);
        conversation.setCreatedBy(currentUserId);
        conversation.setCreatedAt(OffsetDateTime.now());
        conversation.setUpdatedAt(OffsetDateTime.now());

        conversationMapper.insert(conversation);

        // Add both users as participants
        addParticipant(conversation.getId(), currentUserId);
        addParticipant(conversation.getId(), otherUserId);

        return convertToResponse(conversation, currentUserId);
    }

    public void markAsRead(UUID conversationId, String userEmail) {
        User user = userMapper.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        participantMapper.markAsRead(conversationId, user.getId());
    }

    private void addParticipant(UUID conversationId, UUID userId) {
        ConversationParticipant participant = new ConversationParticipant();
        participant.setId(UUID.randomUUID());
        participant.setConversationId(conversationId);
        participant.setUserId(userId);
        participant.setJoinedAt(OffsetDateTime.now());
        participant.setActive(true);

        participantMapper.insert(participant);
    }

    private ConversationResponse convertToResponse(Conversation conversation, UUID currentUserId) {
        List<ConversationParticipant> participants = participantMapper.findByConversationId(conversation.getId());
        
        // Get participant details
        List<ConversationParticipantResponse> participantResponses = new ArrayList<>();
        for (ConversationParticipant participant : participants) {
            User user = userMapper.findById(participant.getUserId()).orElse(null);
            if (user != null) {
                participantResponses.add(new ConversationParticipantResponse(
                    participant.getId(),
                    participant.getUserId(),
                    user.getName(),
                    user.getEmail(),
                    participant.getJoinedAt(),
                    participant.getLastReadAt(),
                    false // TODO: Implement online status
                ));
            }
        }

        // Get unread count
        int unreadCount = conversationMapper.getUnreadCount(conversation.getId(), currentUserId);

        // For DMs, show other user's name as conversation name
        String displayName = conversation.getName();
        if (conversation.getType() == Conversation.ConversationType.DIRECT_MESSAGE) {
            ConversationParticipantResponse otherUser = participantResponses.stream()
                .filter(p -> !p.getUserId().equals(currentUserId))
                .findFirst()
                .orElse(null);
            if (otherUser != null) {
                displayName = otherUser.getUserName();
            }
        }

        return new ConversationResponse(
            conversation.getId(),
            displayName,
            conversation.getType(),
            conversation.getProjectId(),
            conversation.getLastMessage(),
            conversation.getLastMessageAt(),
            unreadCount,
            participantResponses,
            null // TODO: Implement avatar URLs
        );
    }
}