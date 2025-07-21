package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.Conversation;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface ConversationMapper {

    @Insert("INSERT INTO conversations (id, name, type, project_id, created_by) " +
            "VALUES (#{id}, #{name}, #{type}, #{projectId}, #{createdBy})")
    void insert(Conversation conversation);

    @Select("SELECT * FROM conversations WHERE id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "name", column = "name"),
        @Result(property = "type", column = "type"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "lastMessage", column = "last_message"),
        @Result(property = "lastMessageAt", column = "last_message_at"),
        @Result(property = "createdBy", column = "created_by")
    })
    Conversation findById(UUID id);

    @Select("SELECT DISTINCT c.* FROM conversations c " +
            "JOIN conversation_participants cp ON c.id = cp.conversation_id " +
            "WHERE cp.user_id = #{userId} AND cp.is_active = true " +
            "ORDER BY c.updated_at DESC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "name", column = "name"),
        @Result(property = "type", column = "type"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "lastMessage", column = "last_message"),
        @Result(property = "lastMessageAt", column = "last_message_at"),
        @Result(property = "createdBy", column = "created_by")
    })
    List<Conversation> findByUserId(UUID userId);

    @Select("SELECT * FROM conversations " +
            "WHERE type = 'DIRECT_MESSAGE' " +
            "AND id IN (" +
            "  SELECT conversation_id FROM conversation_participants " +
            "  WHERE user_id = #{user1Id}" +
            ") " +
            "AND id IN (" +
            "  SELECT conversation_id FROM conversation_participants " +
            "  WHERE user_id = #{user2Id}" +
            ")")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "name", column = "name"),
        @Result(property = "type", column = "type"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "lastMessage", column = "last_message"),
        @Result(property = "lastMessageAt", column = "last_message_at"),
        @Result(property = "createdBy", column = "created_by")
    })
    Conversation findDirectMessageBetweenUsers(UUID user1Id, UUID user2Id);

    @Update("UPDATE conversations SET " +
            "name = #{name}, " +
            "updated_at = NOW() " +
            "WHERE id = #{id}")
    void update(Conversation conversation);

    @Delete("DELETE FROM conversations WHERE id = #{id}")
    void deleteById(UUID id);

    @Select("SELECT COUNT(*) FROM chat_messages cm " +
            "JOIN conversation_participants cp ON cm.conversation_id = cp.conversation_id " +
            "WHERE cp.conversation_id = #{conversationId} " +
            "AND cp.user_id = #{userId} " +
            "AND cm.created_at > COALESCE(cp.last_read_at, cp.joined_at)")
    int getUnreadCount(UUID conversationId, UUID userId);
}