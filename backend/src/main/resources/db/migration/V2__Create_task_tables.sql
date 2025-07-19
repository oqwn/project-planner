-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    assignee_id UUID NOT NULL,
    project_id UUID NOT NULL,
    created_by UUID NOT NULL,
    due_date DATE NOT NULL,
    estimated_hours DECIMAL(5,2) NOT NULL DEFAULT 1.0,
    actual_hours DECIMAL(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_assignee FOREIGN KEY (assignee_id) REFERENCES users(id),
    CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT fk_task_creator FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT chk_task_status CHECK (status IN ('todo', 'in-progress', 'completed', 'parked')),
    CONSTRAINT chk_task_priority CHECK (priority IN ('low', 'medium', 'high'))
);

-- Create indexes for tasks
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);

-- Create subtasks table
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subtask_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Create index for subtasks
CREATE INDEX idx_subtasks_task ON subtasks(task_id);

-- Create subtask dependencies table
CREATE TABLE subtask_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subtask_id UUID NOT NULL,
    depends_on_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dependency_subtask FOREIGN KEY (subtask_id) REFERENCES subtasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_dependency_depends_on FOREIGN KEY (depends_on_id) REFERENCES subtasks(id) ON DELETE CASCADE,
    CONSTRAINT chk_no_self_dependency CHECK (subtask_id != depends_on_id),
    CONSTRAINT uk_subtask_dependency UNIQUE (subtask_id, depends_on_id)
);

-- Create task_comments table
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for comments
CREATE INDEX idx_task_comments_task ON task_comments(task_id);
CREATE INDEX idx_task_comments_user ON task_comments(user_id);

-- Create task_attachments table
CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_attachment_user FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Create index for attachments
CREATE INDEX idx_task_attachments_task ON task_attachments(task_id);

-- Create task_reminders table
CREATE TABLE task_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    user_id UUID NOT NULL,
    reminder_datetime TIMESTAMP NOT NULL,
    message TEXT,
    is_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reminder_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_reminder_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for reminders
CREATE INDEX idx_task_reminders_task ON task_reminders(task_id);
CREATE INDEX idx_task_reminders_datetime ON task_reminders(reminder_datetime);

-- Create task_tags table
CREATE TABLE task_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    tag VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tag_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT uk_task_tag UNIQUE (task_id, tag)
);

-- Create index for tags
CREATE INDEX idx_task_tags_task ON task_tags(task_id);
CREATE INDEX idx_task_tags_tag ON task_tags(tag);

-- Create comment_mentions table for @mentions in comments
CREATE TABLE comment_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL,
    mentioned_user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mention_comment FOREIGN KEY (comment_id) REFERENCES task_comments(id) ON DELETE CASCADE,
    CONSTRAINT fk_mention_user FOREIGN KEY (mentioned_user_id) REFERENCES users(id),
    CONSTRAINT uk_comment_mention UNIQUE (comment_id, mentioned_user_id)
);

-- Create indexes for mentions
CREATE INDEX idx_comment_mentions_comment ON comment_mentions(comment_id);
CREATE INDEX idx_comment_mentions_user ON comment_mentions(mentioned_user_id);

-- Create dashboard_stats view for Epic 1
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    p.id as project_id,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'in-progress' THEN t.id END) as in_progress_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
    COUNT(DISTINCT CASE WHEN t.status != 'completed' AND t.due_date < CURRENT_DATE THEN t.id END) as overdue_tasks
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id;

-- Create recent_activities view for Epic 1
CREATE OR REPLACE VIEW recent_activities AS
(
    SELECT 
        'task_created' as activity_type,
        t.created_by as user_id,
        t.title as target_item,
        t.created_at as activity_timestamp,
        t.project_id
    FROM tasks t
    
    UNION ALL
    
    SELECT 
        'task_completed' as activity_type,
        t.assignee_id as user_id,
        t.title as target_item,
        t.updated_at as activity_timestamp,
        t.project_id
    FROM tasks t
    WHERE t.status = 'completed'
    
    UNION ALL
    
    SELECT 
        'comment_added' as activity_type,
        tc.user_id,
        t.title as target_item,
        tc.created_at as activity_timestamp,
        t.project_id
    FROM task_comments tc
    JOIN tasks t ON tc.task_id = t.id
    
    UNION ALL
    
    SELECT 
        'file_uploaded' as activity_type,
        ta.uploaded_by as user_id,
        t.title as target_item,
        ta.uploaded_at as activity_timestamp,
        t.project_id
    FROM task_attachments ta
    JOIN tasks t ON ta.task_id = t.id
)
ORDER BY activity_timestamp DESC;

-- Add update trigger for tasks
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subtasks_updated_at BEFORE UPDATE ON subtasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_comments_updated_at BEFORE UPDATE ON task_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();