-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('ADMIN', 'PROJECT_MANAGER', 'TEAM_LEAD', 'MEMBER', 'VIEWER');
CREATE TYPE project_status AS ENUM ('PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED');
CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'PARKED');
CREATE TYPE task_priority AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'MEMBER',
    interests TEXT[],
    associations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status project_status NOT NULL DEFAULT 'PLANNING',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table with enhanced features
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    assignee_id UUID REFERENCES users(id),
    status task_status NOT NULL DEFAULT 'TODO',
    priority task_priority NOT NULL DEFAULT 'MEDIUM',
    due_date DATE,
    estimated_hours DECIMAL(8,2),
    actual_hours DECIMAL(8,2),
    tags TEXT[],
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subtasks table
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    depends_on UUID REFERENCES subtasks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Time entries table
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    hours DECIMAL(8,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Task comments table
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    mentions UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Legacy comments table for backward compatibility
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    mentions UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Task attachments table
CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    file_url VARCHAR(500),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Task reminders table
CREATE TABLE task_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    reminder_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    message TEXT,
    is_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Milestones table
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'achieved', 'missed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX idx_task_reminders_task_id ON task_reminders(task_id);
CREATE INDEX idx_task_reminders_datetime ON task_reminders(reminder_datetime);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Dashboard stats view
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'COMPLETED' THEN t.id END) as completed_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'IN_PROGRESS' THEN t.id END) as in_progress_tasks,
    COUNT(DISTINCT CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'COMPLETED' THEN t.id END) as overdue_tasks,
    COUNT(DISTINCT u.id) as team_members,
    COALESCE(AVG(t.actual_hours), 0) as average_task_hours
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
LEFT JOIN users u ON u.id = t.assignee_id
WHERE p.status = 'ACTIVE';

-- Recent activities view
CREATE OR REPLACE VIEW recent_activities AS
(
    SELECT 
        'task_created' as activity_type,
        t.id as entity_id,
        t.name as entity_name,
        t.created_by as user_id,
        u.name as user_name,
        t.created_at as activity_time,
        'created task' as action
    FROM tasks t
    JOIN users u ON t.created_by = u.id
    
    UNION ALL
    
    SELECT 
        'task_completed' as activity_type,
        t.id as entity_id,
        t.name as entity_name,
        t.assignee_id as user_id,
        u.name as user_name,
        t.updated_at as activity_time,
        'completed task' as action
    FROM tasks t
    JOIN users u ON t.assignee_id = u.id
    WHERE t.status = 'COMPLETED'
    
    UNION ALL
    
    SELECT 
        'comment_added' as activity_type,
        c.task_id as entity_id,
        t.name as entity_name,
        c.user_id as user_id,
        u.name as user_name,
        c.created_at as activity_time,
        'commented on' as action
    FROM task_comments c
    JOIN tasks t ON c.task_id = t.id
    JOIN users u ON c.user_id = u.id
)
ORDER BY activity_time DESC
LIMIT 50;

-- Insert test users with proper BCrypt passwords
-- Password for regular users: password123
-- Password for admin: admin123
INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440011', 'sarah.chen@example.com', 'Sarah Chen', '$2a$10$3R4VMcgep8JtKo0D70RUL.Zgr39eKJ49yTdIF.4vrt29lkD63MPk.', 'TEAM_LEAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440012', 'mike.johnson@example.com', 'Mike Johnson', '$2a$10$3R4VMcgep8JtKo0D70RUL.Zgr39eKJ49yTdIF.4vrt29lkD63MPk.', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440013', 'emily.davis@example.com', 'Emily Davis', '$2a$10$3R4VMcgep8JtKo0D70RUL.Zgr39eKJ49yTdIF.4vrt29lkD63MPk.', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440014', 'john.doe@example.com', 'John Doe', '$2a$10$3R4VMcgep8JtKo0D70RUL.Zgr39eKJ49yTdIF.4vrt29lkD63MPk.', 'PROJECT_MANAGER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440015', 'lisa.wang@example.com', 'Lisa Wang', '$2a$10$3R4VMcgep8JtKo0D70RUL.Zgr39eKJ49yTdIF.4vrt29lkD63MPk.', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440016', 'tom.wilson@example.com', 'Tom Wilson', '$2a$10$3R4VMcgep8JtKo0D70RUL.Zgr39eKJ49yTdIF.4vrt29lkD63MPk.', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440099', 'admin@example.com', 'Admin User', '$2a$10$yCs3qA7Xx5/kaTPJW4iq..2QImwSLiOGnNXCvMbdTnJhuS3mnRedW', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample projects
INSERT INTO projects (id, name, description, start_date, end_date, status, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Project Alpha', 'Main product development project', '2025-01-01', '2025-06-30', 'ACTIVE', '550e8400-e29b-41d4-a716-446655440014'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Beta Release', 'Beta testing and release preparation', '2025-01-15', '2025-03-15', 'ACTIVE', '550e8400-e29b-41d4-a716-446655440014');

-- Insert sample tasks
INSERT INTO tasks (id, name, description, status, priority, assignee_id, project_id, created_by, due_date, estimated_hours, actual_hours, tags) VALUES
    ('550e8400-e29b-41d4-a716-446655440021', 'Design system implementation', 'Create comprehensive design system', 'IN_PROGRESS', 'HIGH', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-01-25', 16.0, 8.0, ARRAY['design', 'ui', 'frontend']),
    ('550e8400-e29b-41d4-a716-446655440022', 'API integration testing', 'Test all API endpoints', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440013', '2025-01-23', 12.0, NULL, ARRAY['testing', 'api', 'backend']),
    ('550e8400-e29b-41d4-a716-446655440023', 'User authentication flow', 'Implement secure authentication', 'COMPLETED', 'HIGH', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-01-20', 20.0, 18.0, ARRAY['security', 'auth', 'backend']),
    ('550e8400-e29b-41d4-a716-446655440024', 'Database optimization', 'Optimize queries and indexing', 'TODO', 'LOW', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', '2025-01-28', 8.0, NULL, ARRAY['database', 'performance']),
    ('550e8400-e29b-41d4-a716-446655440025', 'Mobile responsiveness', 'Ensure mobile compatibility', 'IN_PROGRESS', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '2025-01-26', 14.0, 6.0, ARRAY['mobile', 'responsive', 'ui']),
    ('550e8400-e29b-41d4-a716-446655440026', 'Performance monitoring', 'Setup monitoring tools', 'TODO', 'HIGH', '550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-01-22', 10.0, NULL, ARRAY['monitoring', 'devops']),
    ('550e8400-e29b-41d4-a716-446655440027', 'Data migration scripts', 'Create migration tools', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-01-30', 15.0, NULL, ARRAY['migration', 'data']),
    ('550e8400-e29b-41d4-a716-446655440028', 'Security audit', 'Security vulnerability assessment', 'IN_PROGRESS', 'HIGH', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-01-24', 20.0, 5.0, ARRAY['security', 'audit']);

-- Insert subtasks
INSERT INTO subtasks (id, task_id, name, is_completed) VALUES
    ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', 'Create color palette', true),
    ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440021', 'Design typography system', true),
    ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440021', 'Build component library', false),
    ('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440021', 'Document usage guidelines', false),
    ('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440022', 'Test authentication endpoints', false),
    ('550e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440022', 'Test task management APIs', false),
    ('550e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440022', 'Test error handling', false);

-- Insert sample comments
INSERT INTO task_comments (id, task_id, user_id, content) VALUES
    ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440012', 'Great progress on the color palette!'),
    ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440014', 'Authentication working perfectly!'),
    ('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440011', 'Please prioritize mobile navigation.'),
    ('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440014', 'Found XSS vulnerabilities - fixing now.');

-- Copy to legacy comments table for compatibility
INSERT INTO comments (id, task_id, user_id, content)
SELECT id, task_id, user_id, content FROM task_comments;

-- Insert time entries
INSERT INTO time_entries (id, user_id, task_id, hours, date, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440021', 4.5, '2025-01-19', 'Color palette work'),
    ('550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440021', 3.5, '2025-01-18', 'Typography design'),
    ('550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440023', 8.0, '2025-01-17', 'JWT implementation'),
    ('550e8400-e29b-41d4-a716-446655440084', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440023', 10.0, '2025-01-16', 'Login page development'),
    ('550e8400-e29b-41d4-a716-446655440085', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440025', 6.0, '2025-01-19', 'Responsive layout work');