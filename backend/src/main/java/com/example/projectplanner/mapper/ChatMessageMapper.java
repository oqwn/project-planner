package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.ChatMessage;
import com.example.projectplanner.dto.ChatMessageResponse;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.type.JdbcType;

import java.util.List;
import java.util.UUID;

@Mapper
public interface ChatMessageMapper {

    @Insert("INSERT INTO chat_messages (id, conversation_id, project_id, sender_id, content, type, reply_to_message_id, mentions, attachment_ids, created_at, updated_at, is_deleted) " +
            "VALUES (#{id}, #{conversationId}, #{projectId}, #{senderId}, #{content}, #{type}::message_type, #{replyToMessageId}, #{mentions, typeHandler=org.apache.ibatis.type.ArrayTypeHandler}, #{attachmentIds, typeHandler=org.apache.ibatis.type.ArrayTypeHandler}, #{createdAt}, #{updatedAt}, #{isDeleted})")
    void insert(ChatMessage message);

    @Select("SELECT cm.*, u.name as sender_name, u.email as sender_email, " +
            "rm.content as reply_to_content, ru.name as reply_to_sender " +
            "FROM chat_messages cm " +
            "JOIN users u ON cm.sender_id = u.id " +
            "LEFT JOIN chat_messages rm ON cm.reply_to_message_id = rm.id " +
            "LEFT JOIN users ru ON rm.sender_id = ru.id " +
            "WHERE cm.project_id = #{projectId} AND cm.is_deleted = false " +
            "ORDER BY cm.created_at DESC " +
            "LIMIT #{limit} OFFSET #{offset}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "senderId", column = "sender_id"),
        @Result(property = "senderName", column = "sender_name"),
        @Result(property = "senderEmail", column = "sender_email"),
        @Result(property = "content", column = "content"),
        @Result(property = "type", column = "type"),
        @Result(property = "replyToMessageId", column = "reply_to_message_id"),
        @Result(property = "replyToContent", column = "reply_to_content"),
        @Result(property = "replyToSender", column = "reply_to_sender"),
        @Result(property = "mentions", column = "mentions", jdbcType = JdbcType.ARRAY),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "isDeleted", column = "is_deleted")
    })
    List<ChatMessageResponse> findByProjectId(@Param("projectId") UUID projectId, 
                                            @Param("limit") int limit, 
                                            @Param("offset") int offset);

    @Select("SELECT cm.*, u.name as sender_name, u.email as sender_email, " +
            "rm.content as reply_to_content, ru.name as reply_to_sender " +
            "FROM chat_messages cm " +
            "JOIN users u ON cm.sender_id = u.id " +
            "LEFT JOIN chat_messages rm ON cm.reply_to_message_id = rm.id " +
            "LEFT JOIN users ru ON rm.sender_id = ru.id " +
            "WHERE cm.conversation_id = #{conversationId} AND cm.is_deleted = false " +
            "ORDER BY cm.created_at DESC " +
            "LIMIT #{limit} OFFSET #{offset}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "conversationId", column = "conversation_id"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "senderId", column = "sender_id"),
        @Result(property = "senderName", column = "sender_name"),
        @Result(property = "senderEmail", column = "sender_email"),
        @Result(property = "content", column = "content"),
        @Result(property = "type", column = "type"),
        @Result(property = "replyToMessageId", column = "reply_to_message_id"),
        @Result(property = "replyToContent", column = "reply_to_content"),
        @Result(property = "replyToSender", column = "reply_to_sender"),
        @Result(property = "mentions", column = "mentions", jdbcType = JdbcType.ARRAY),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "isDeleted", column = "is_deleted")
    })
    List<ChatMessageResponse> findByConversationId(@Param("conversationId") UUID conversationId, 
                                                 @Param("limit") int limit, 
                                                 @Param("offset") int offset);

    @Select("SELECT cm.*, u.name as sender_name, u.email as sender_email, " +
            "rm.content as reply_to_content, ru.name as reply_to_sender " +
            "FROM chat_messages cm " +
            "JOIN users u ON cm.sender_id = u.id " +
            "LEFT JOIN chat_messages rm ON cm.reply_to_message_id = rm.id " +
            "LEFT JOIN users ru ON rm.sender_id = ru.id " +
            "WHERE cm.id = #{id} AND cm.is_deleted = false")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "senderId", column = "sender_id"),
        @Result(property = "senderName", column = "sender_name"),
        @Result(property = "senderEmail", column = "sender_email"),
        @Result(property = "content", column = "content"),
        @Result(property = "type", column = "type"),
        @Result(property = "replyToMessageId", column = "reply_to_message_id"),
        @Result(property = "replyToContent", column = "reply_to_content"),
        @Result(property = "replyToSender", column = "reply_to_sender"),
        @Result(property = "mentions", column = "mentions", jdbcType = JdbcType.ARRAY),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "isDeleted", column = "is_deleted")
    })
    ChatMessageResponse findById(@Param("id") UUID id);

    @Update("UPDATE chat_messages SET content = #{content}, updated_at = #{updatedAt} WHERE id = #{id}")
    void updateContent(ChatMessage message);

    @Update("UPDATE chat_messages SET is_deleted = true, updated_at = #{updatedAt} WHERE id = #{id}")
    void softDelete(@Param("id") UUID id, @Param("updatedAt") java.time.OffsetDateTime updatedAt);

    @Select("SELECT COUNT(*) FROM chat_messages WHERE project_id = #{projectId} AND is_deleted = false")
    long countByProjectId(@Param("projectId") UUID projectId);
}