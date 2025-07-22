-- Add performance indexes for conversation and message queries

-- Composite index for conversation participants lookup (used in mark-read)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversation_participants_composite 
ON conversation_participants(conversation_id, user_id);

-- Composite index for message queries by conversation and creation time (used in unread count)  
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_conversation_created_at 
ON chat_messages(conversation_id, created_at);

-- Index for conversation participants by user (used in getUserConversations)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversation_participants_user_active 
ON conversation_participants(user_id, is_active) WHERE is_active = true;

-- Index for message status tracker queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_message_status_tracker_composite
ON message_status_tracker(message_id, user_id);