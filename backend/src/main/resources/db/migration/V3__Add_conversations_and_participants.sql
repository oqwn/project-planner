-- V3: Add conversations and participants tables for enhanced chat system

-- Create conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('DIRECT_MESSAGE', 'GROUP_CHAT')),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- null for direct messages
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create conversation participants table
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(conversation_id, user_id)
);

-- Add conversation_id to chat_messages table
ALTER TABLE chat_messages 
ADD COLUMN conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversations_project_id ON conversations(project_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);

-- Create function to update conversation updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET updated_at = NOW(), 
        last_message = NEW.content, 
        last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update conversation when new message is added
CREATE TRIGGER trigger_update_conversation_on_message
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- Migrate existing chat messages to use conversations
-- Create group conversations for each project that has messages
INSERT INTO conversations (id, name, type, project_id, created_by, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    p.name || ' - Group Chat',
    'GROUP_CHAT',
    cm.project_id,
    (SELECT id FROM users LIMIT 1), -- Use first user as creator
    MIN(cm.created_at),
    MAX(cm.updated_at)
FROM chat_messages cm
JOIN projects p ON cm.project_id = p.id
WHERE cm.project_id IS NOT NULL
GROUP BY cm.project_id, p.name;

-- Update chat_messages to reference the new conversations
UPDATE chat_messages 
SET conversation_id = c.id
FROM conversations c
WHERE chat_messages.project_id = c.project_id 
AND c.type = 'GROUP_CHAT';

-- Add all project members as participants in group conversations
INSERT INTO conversation_participants (conversation_id, user_id, joined_at)
SELECT DISTINCT 
    c.id,
    cm.sender_id,
    MIN(cm.created_at)
FROM conversations c
JOIN chat_messages cm ON c.project_id = cm.project_id
WHERE c.type = 'GROUP_CHAT'
GROUP BY c.id, cm.sender_id;

-- Update last message info for conversations
UPDATE conversations
SET 
    last_message = (
        SELECT content 
        FROM chat_messages 
        WHERE conversation_id = conversations.id 
        ORDER BY created_at DESC 
        LIMIT 1
    ),
    last_message_at = (
        SELECT created_at 
        FROM chat_messages 
        WHERE conversation_id = conversations.id 
        ORDER BY created_at DESC 
        LIMIT 1
    );