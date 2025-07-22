-- Create enum for message status if not exists
DO $$ BEGIN
    CREATE TYPE message_status AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add message status tracking to chat_messages
ALTER TABLE chat_messages 
ADD COLUMN client_message_id VARCHAR(255),
ADD COLUMN status message_status DEFAULT 'SENT';

-- Create index for client message ID lookups
CREATE INDEX idx_chat_messages_client_message_id ON chat_messages(client_message_id);

-- Create index for status queries
CREATE INDEX idx_chat_messages_status ON chat_messages(status);

-- Create message status tracker table
CREATE TABLE IF NOT EXISTS message_status_tracker (
    id UUID PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_delivered BOOLEAN DEFAULT FALSE,
    is_read BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id)
);

-- Create indexes for message status tracker
CREATE INDEX idx_message_status_tracker_message_id ON message_status_tracker(message_id);
CREATE INDEX idx_message_status_tracker_user_id ON message_status_tracker(user_id);
CREATE INDEX idx_message_status_tracker_status ON message_status_tracker(is_delivered, is_read);