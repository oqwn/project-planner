package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.MessageStatusTracker;
import org.apache.ibatis.annotations.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Mapper
public interface MessageStatusMapper {
    
    @Insert("INSERT INTO message_status_tracker (id, message_id, user_id, is_delivered, is_read, " +
            "delivered_at, read_at, created_at) VALUES (#{id}, #{messageId}, #{userId}, " +
            "#{isDelivered}, #{isRead}, #{deliveredAt}, #{readAt}, #{createdAt})")
    void insert(MessageStatusTracker tracker);
    
    @Update("UPDATE message_status_tracker SET is_delivered = true, delivered_at = #{deliveredAt} " +
            "WHERE message_id = #{messageId} AND user_id = #{userId} AND is_delivered = false")
    void markDelivered(@Param("messageId") UUID messageId, 
                      @Param("userId") UUID userId,
                      @Param("deliveredAt") OffsetDateTime deliveredAt);
    
    @Update("UPDATE message_status_tracker SET is_read = true, read_at = #{readAt}, " +
            "is_delivered = true, delivered_at = COALESCE(delivered_at, #{readAt}) " +
            "WHERE message_id = #{messageId} AND user_id = #{userId} AND is_read = false")
    void markRead(@Param("messageId") UUID messageId, 
                  @Param("userId") UUID userId,
                  @Param("readAt") OffsetDateTime readAt);
    
    default void markDelivered(UUID messageId, UUID userId) {
        markDelivered(messageId, userId, OffsetDateTime.now());
    }
    
    default void markRead(UUID messageId, UUID userId) {
        markRead(messageId, userId, OffsetDateTime.now());
    }
    
    @Select("SELECT * FROM message_status_tracker WHERE message_id = #{messageId}")
    List<MessageStatusTracker> findByMessageId(UUID messageId);
    
    @Select("SELECT * FROM message_status_tracker WHERE message_id = #{messageId} AND user_id = #{userId}")
    MessageStatusTracker findByMessageAndUser(@Param("messageId") UUID messageId, 
                                             @Param("userId") UUID userId);
    
    @Select("SELECT COUNT(*) FROM message_status_tracker WHERE message_id = #{messageId} AND is_delivered = true")
    int countDelivered(UUID messageId);
    
    @Select("SELECT COUNT(*) FROM message_status_tracker WHERE message_id = #{messageId} AND is_read = true")
    int countRead(UUID messageId);
}