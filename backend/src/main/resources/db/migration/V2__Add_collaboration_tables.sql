-- Create enum for message types
CREATE TYPE message_type AS ENUM ('TEXT', 'FILE', 'SYSTEM');

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    type message_type NOT NULL DEFAULT 'TEXT',
    reply_to_message_id UUID REFERENCES chat_messages(id),
    mentions TEXT[], -- Array of mentioned usernames/emails
    attachment_ids UUID[], -- Array of shared file IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Shared files table
CREATE TABLE shared_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL, -- System generated filename
    original_file_name VARCHAR(255) NOT NULL, -- Original filename from user
    file_type VARCHAR(100),
    file_size BIGINT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes for better performance
CREATE INDEX idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_reply_to ON chat_messages(reply_to_message_id);

CREATE INDEX idx_shared_files_project_id ON shared_files(project_id);
CREATE INDEX idx_shared_files_uploaded_at ON shared_files(uploaded_at);
CREATE INDEX idx_shared_files_uploaded_by ON shared_files(uploaded_by);

-- Insert some sample chat messages for testing
INSERT INTO chat_messages (project_id, sender_id, content, type) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', 'Welcome to the project chat! Let''s collaborate effectively.', 'SYSTEM'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'Thanks @john.doe@example.com! Excited to work on this project.', 'TEXT'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', 'I''ve completed the API testing. The endpoints are working well.', 'TEXT'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440013', 'Beta release preparation is going smoothly. UI components look great!', 'TEXT'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440015', 'Mobile responsiveness testing is complete. Ready for review.', 'TEXT');