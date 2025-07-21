package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.ConversationParticipant;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface ConversationParticipantMapper {

    @Insert("INSERT INTO conversation_participants (id, conversation_id, user_id, joined_at) " +
            "VALUES (#{id}, #{conversationId}, #{userId}, #{joinedAt})")
    void insert(ConversationParticipant participant);

    @Select("SELECT * FROM conversation_participants WHERE id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "conversationId", column = "conversation_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "joinedAt", column = "joined_at"),
        @Result(property = "lastReadAt", column = "last_read_at"),
        @Result(property = "isActive", column = "is_active")
    })
    ConversationParticipant findById(UUID id);

    @Select("SELECT cp.*, u.name as user_name, u.email as user_email " +
            "FROM conversation_participants cp " +
            "JOIN users u ON cp.user_id = u.id " +
            "WHERE cp.conversation_id = #{conversationId} AND cp.is_active = true")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "conversationId", column = "conversation_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "joinedAt", column = "joined_at"),
        @Result(property = "lastReadAt", column = "last_read_at"),
        @Result(property = "isActive", column = "is_active")
    })
    List<ConversationParticipant> findByConversationId(UUID conversationId);

    @Select("SELECT * FROM conversation_participants " +
            "WHERE conversation_id = #{conversationId} AND user_id = #{userId}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "conversationId", column = "conversation_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "joinedAt", column = "joined_at"),
        @Result(property = "lastReadAt", column = "last_read_at"),
        @Result(property = "isActive", column = "is_active")
    })
    ConversationParticipant findByConversationAndUser(UUID conversationId, UUID userId);

    @Update("UPDATE conversation_participants SET " +
            "last_read_at = NOW() " +
            "WHERE conversation_id = #{conversationId} AND user_id = #{userId}")
    void markAsRead(UUID conversationId, UUID userId);

    @Update("UPDATE conversation_participants SET " +
            "is_active = #{isActive} " +
            "WHERE id = #{id}")
    void updateActiveStatus(UUID id, boolean isActive);

    @Delete("DELETE FROM conversation_participants WHERE id = #{id}")
    void deleteById(UUID id);
}