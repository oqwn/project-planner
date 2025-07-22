-- Add simple performance indexes (replacing V14)
-- Adding only the most critical index for mark-read performance

-- Most important: Composite index for conversation participants lookup (used in mark-read)
CREATE INDEX IF NOT EXISTS idx_conversation_participants_lookup 
ON conversation_participants(conversation_id, user_id);