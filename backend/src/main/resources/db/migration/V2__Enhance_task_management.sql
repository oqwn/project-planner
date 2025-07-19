-- Enhance existing task management schema to support Epic 2 requirements
-- Note: This works with the existing V1 schema

-- Add missing columns to existing tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS actual_hours DECIMAL(5,2);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags VARCHAR(50)[];

-- Create task_attachments table (new)
CREATE TABLE IF NOT EXISTS task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_attachment_user FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Create task_reminders table (new)
CREATE TABLE IF NOT EXISTS task_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    user_id UUID NOT NULL,
    reminder_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    message TEXT,
    is_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reminder_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_reminder_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add depends_on column to existing subtasks table
ALTER TABLE subtasks ADD COLUMN IF NOT EXISTS depends_on_array UUID[];

-- Add mentions column to existing comments table  
ALTER TABLE comments ADD COLUMN IF NOT EXISTS mentions_array UUID[];

-- Create additional indexes
CREATE INDEX IF NOT EXISTS idx_task_attachments_task ON task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_reminders_task ON task_reminders(task_id);
CREATE INDEX IF NOT EXISTS idx_task_reminders_datetime ON task_reminders(reminder_datetime);

-- Create enhanced views for dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    p.id as project_id,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'IN_PROGRESS' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status != 'COMPLETED' AND t.due_date < CURRENT_DATE THEN 1 END) as overdue_tasks
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id;

-- Create enhanced recent activities view
CREATE OR REPLACE VIEW recent_activities AS
SELECT 
    'task_created' as activity_type,
    u.name as user_name,
    t.name as target_item,  -- Use existing 'name' column
    t.created_at as activity_time,
    t.project_id
FROM tasks t
JOIN users u ON t.created_by = u.id
UNION ALL
SELECT 
    'comment_added' as activity_type,
    u.name as user_name,
    t.name as target_item,  -- Use existing 'name' column
    c.created_at as activity_time,
    t.project_id
FROM comments c  -- Use existing 'comments' table
JOIN tasks t ON c.task_id = t.id
JOIN users u ON c.user_id = u.id
UNION ALL
SELECT 
    'file_uploaded' as activity_type,
    u.name as user_name,
    t.name as target_item,
    ta.uploaded_at as activity_time,
    t.project_id
FROM task_attachments ta
JOIN tasks t ON ta.task_id = t.id
JOIN users u ON ta.uploaded_by = u.id
ORDER BY activity_time DESC;