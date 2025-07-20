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
    p.id as project_id,
    p.name as project_name,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'COMPLETED' THEN t.id END) as completed_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'IN_PROGRESS' THEN t.id END) as in_progress_tasks,
    COUNT(DISTINCT CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'COMPLETED' THEN t.id END) as overdue_tasks,
    COUNT(DISTINCT u.id) as team_members,
    COALESCE(AVG(t.actual_hours), 0) as average_task_hours
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
LEFT JOIN users u ON u.id = t.assignee_id
WHERE p.status = 'ACTIVE'
GROUP BY p.id, p.name;

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

-- Insert sample tasks (Project Alpha - 15 tasks)
INSERT INTO tasks (id, name, description, status, priority, assignee_id, project_id, created_by, due_date, estimated_hours, actual_hours, tags) VALUES
    ('550e8400-e29b-41d4-a716-446655440021', 'Design system implementation', 'Create comprehensive design system with components library', 'IN_PROGRESS', 'HIGH', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-01-25', 16.0, 8.0, ARRAY['design', 'ui', 'frontend']),
    ('550e8400-e29b-41d4-a716-446655440022', 'API integration testing', 'Test all API endpoints and validate responses', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440013', '2025-01-23', 12.0, NULL, ARRAY['testing', 'api', 'backend']),
    ('550e8400-e29b-41d4-a716-446655440023', 'User authentication flow', 'Implement secure authentication with JWT tokens', 'COMPLETED', 'HIGH', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-01-20', 20.0, 18.0, ARRAY['security', 'auth', 'backend']),
    ('550e8400-e29b-41d4-a716-446655440024', 'Database optimization', 'Optimize queries and indexing for better performance', 'TODO', 'LOW', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', '2025-01-28', 8.0, NULL, ARRAY['database', 'performance']),
    ('550e8400-e29b-41d4-a716-446655440025', 'Mobile responsiveness', 'Ensure mobile compatibility across all devices', 'IN_PROGRESS', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '2025-01-26', 14.0, 6.0, ARRAY['mobile', 'responsive', 'ui']),
    ('550e8400-e29b-41d4-a716-446655440029', 'Project dashboard development', 'Build interactive project dashboard with analytics', 'TODO', 'HIGH', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-01', 24.0, NULL, ARRAY['dashboard', 'analytics', 'frontend']),
    ('550e8400-e29b-41d4-a716-446655440030', 'Task management system', 'Implement CRUD operations for task management', 'IN_PROGRESS', 'HIGH', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-01-29', 20.0, 8.0, ARRAY['crud', 'backend', 'tasks']),
    ('550e8400-e29b-41d4-a716-446655440031', 'File upload functionality', 'Add file upload and management features', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-05', 16.0, NULL, ARRAY['files', 'upload', 'storage']),
    ('550e8400-e29b-41d4-a716-446655440032', 'Real-time notifications', 'Implement WebSocket notifications for real-time updates', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-03', 18.0, NULL, ARRAY['websocket', 'notifications', 'realtime']),
    ('550e8400-e29b-41d4-a716-446655440033', 'User profile management', 'Create user profile pages with preferences', 'TODO', 'LOW', '550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-07', 12.0, NULL, ARRAY['profile', 'user', 'preferences']),
    ('550e8400-e29b-41d4-a716-446655440034', 'Search and filtering', 'Add advanced search and filtering capabilities', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-04', 14.0, NULL, ARRAY['search', 'filter', 'frontend']),
    ('550e8400-e29b-41d4-a716-446655440035', 'Email notifications', 'Set up email notification system for important events', 'TODO', 'LOW', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-10', 10.0, NULL, ARRAY['email', 'notifications', 'integration']),
    ('550e8400-e29b-41d4-a716-446655440036', 'Team collaboration features', 'Add team chat and collaboration tools', 'TODO', 'HIGH', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-08', 22.0, NULL, ARRAY['collaboration', 'chat', 'team']),
    ('550e8400-e29b-41d4-a716-446655440037', 'Data export functionality', 'Enable data export in multiple formats (CSV, PDF, Excel)', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-06', 16.0, NULL, ARRAY['export', 'csv', 'pdf']),
    ('550e8400-e29b-41d4-a716-446655440038', 'Time tracking integration', 'Integrate time tracking with project tasks', 'IN_PROGRESS', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-02', 18.0, 4.0, ARRAY['time', 'tracking', 'integration']),
    ('550e8400-e29b-41d4-a716-446655440039', 'Calendar integration', 'Integrate with external calendar systems', 'TODO', 'LOW', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-12', 12.0, NULL, ARRAY['calendar', 'integration', 'scheduling']),

-- Beta Release Project tasks (8 tasks)
    ('550e8400-e29b-41d4-a716-446655440026', 'Performance monitoring', 'Setup monitoring tools and dashboards', 'TODO', 'HIGH', '550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-01-22', 10.0, NULL, ARRAY['monitoring', 'devops']),
    ('550e8400-e29b-41d4-a716-446655440027', 'Data migration scripts', 'Create migration tools for legacy data', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-01-30', 15.0, NULL, ARRAY['migration', 'data']),
    ('550e8400-e29b-41d4-a716-446655440028', 'Security audit', 'Security vulnerability assessment and fixes', 'IN_PROGRESS', 'HIGH', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-01-24', 20.0, 5.0, ARRAY['security', 'audit']),
    ('550e8400-e29b-41d4-a716-446655440040', 'Load testing', 'Conduct comprehensive load testing of the application', 'TODO', 'HIGH', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-02-14', 16.0, NULL, ARRAY['load-testing', 'performance', 'qa']),
    ('550e8400-e29b-41d4-a716-446655440041', 'User acceptance testing', 'Coordinate UAT with stakeholders', 'TODO', 'HIGH', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-02-16', 12.0, NULL, ARRAY['uat', 'testing', 'stakeholders']),
    ('550e8400-e29b-41d4-a716-446655440042', 'Documentation finalization', 'Complete technical and user documentation', 'IN_PROGRESS', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-02-10', 14.0, 3.0, ARRAY['documentation', 'manual', 'tech-docs']),
    ('550e8400-e29b-41d4-a716-446655440043', 'Deployment automation', 'Setup CI/CD pipeline for automated deployments', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-02-08', 18.0, NULL, ARRAY['cicd', 'deployment', 'automation']),
    ('550e8400-e29b-41d4-a716-446655440044', 'Beta release preparation', 'Prepare for beta release including user onboarding', 'TODO', 'HIGH', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-02-18', 10.0, NULL, ARRAY['beta', 'release', 'onboarding']);

-- Insert subtasks (60+ subtasks across all tasks)
INSERT INTO subtasks (id, task_id, name, is_completed) VALUES
    -- Design system implementation subtasks
    ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440021', 'Create color palette', true),
    ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440021', 'Design typography system', true),
    ('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440021', 'Build component library', false),
    ('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440021', 'Document usage guidelines', false),
    ('550e8400-e29b-41d4-a716-446655440055', '550e8400-e29b-41d4-a716-446655440021', 'Create Storybook setup', false),

    -- API integration testing subtasks
    ('550e8400-e29b-41d4-a716-446655440056', '550e8400-e29b-41d4-a716-446655440022', 'Test authentication endpoints', false),
    ('550e8400-e29b-41d4-a716-446655440057', '550e8400-e29b-41d4-a716-446655440022', 'Test task management APIs', false),
    ('550e8400-e29b-41d4-a716-446655440058', '550e8400-e29b-41d4-a716-446655440022', 'Test error handling', false),
    ('550e8400-e29b-41d4-a716-446655440059', '550e8400-e29b-41d4-a716-446655440022', 'Test data validation', false),

    -- User authentication flow subtasks
    ('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440023', 'Implement JWT tokens', true),
    ('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440023', 'Create login page', true),
    ('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440023', 'Create registration page', true),
    ('550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440023', 'Implement password reset', true),

    -- Database optimization subtasks
    ('550e8400-e29b-41d4-a716-446655440064', '550e8400-e29b-41d4-a716-446655440024', 'Analyze query performance', false),
    ('550e8400-e29b-41d4-a716-446655440065', '550e8400-e29b-41d4-a716-446655440024', 'Add database indexes', false),
    ('550e8400-e29b-41d4-a716-446655440066', '550e8400-e29b-41d4-a716-446655440024', 'Optimize complex queries', false),

    -- Mobile responsiveness subtasks
    ('550e8400-e29b-41d4-a716-446655440067', '550e8400-e29b-41d4-a716-446655440025', 'Create mobile navigation', false),
    ('550e8400-e29b-41d4-a716-446655440068', '550e8400-e29b-41d4-a716-446655440025', 'Optimize touch interactions', false),
    ('550e8400-e29b-41d4-a716-446655440069', '550e8400-e29b-41d4-a716-446655440025', 'Test on various devices', false),
    ('550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440025', 'Responsive grid layout', true),

    -- Project dashboard development subtasks
    ('550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440029', 'Design dashboard layout', false),
    ('550e8400-e29b-41d4-a716-446655440072', '550e8400-e29b-41d4-a716-446655440029', 'Implement charts and graphs', false),
    ('550e8400-e29b-41d4-a716-446655440073', '550e8400-e29b-41d4-a716-446655440029', 'Add real-time data updates', false),
    ('550e8400-e29b-41d4-a716-446655440074', '550e8400-e29b-41d4-a716-446655440029', 'Create custom widgets', false),

    -- Task management system subtasks
    ('550e8400-e29b-41d4-a716-446655440075', '550e8400-e29b-41d4-a716-446655440030', 'Create task creation form', true),
    ('550e8400-e29b-41d4-a716-446655440076', '550e8400-e29b-41d4-a716-446655440030', 'Implement task editing', false),
    ('550e8400-e29b-41d4-a716-446655440077', '550e8400-e29b-41d4-a716-446655440030', 'Add task deletion', false),
    ('550e8400-e29b-41d4-a716-446655440078', '550e8400-e29b-41d4-a716-446655440030', 'Implement task status updates', true),

    -- File upload functionality subtasks
    ('550e8400-e29b-41d4-a716-446655440079', '550e8400-e29b-41d4-a716-446655440031', 'Setup file storage backend', false),
    ('550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440031', 'Create upload UI component', false),
    ('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440031', 'Implement file validation', false),
    ('550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440031', 'Add file preview functionality', false),

    -- Real-time notifications subtasks
    ('550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440032', 'Setup WebSocket server', false),
    ('550e8400-e29b-41d4-a716-446655440084', '550e8400-e29b-41d4-a716-446655440032', 'Create notification UI', false),
    ('550e8400-e29b-41d4-a716-446655440085', '550e8400-e29b-41d4-a716-446655440032', 'Implement push notifications', false),

    -- User profile management subtasks
    ('550e8400-e29b-41d4-a716-446655440086', '550e8400-e29b-41d4-a716-446655440033', 'Create profile page layout', false),
    ('550e8400-e29b-41d4-a716-446655440087', '550e8400-e29b-41d4-a716-446655440033', 'Add avatar upload', false),
    ('550e8400-e29b-41d4-a716-446655440088', '550e8400-e29b-41d4-a716-446655440033', 'Implement preferences settings', false),

    -- Search and filtering subtasks
    ('550e8400-e29b-41d4-a716-446655440089', '550e8400-e29b-41d4-a716-446655440034', 'Create search interface', false),
    ('550e8400-e29b-41d4-a716-446655440090', '550e8400-e29b-41d4-a716-446655440034', 'Implement advanced filters', false),
    ('550e8400-e29b-41d4-a716-446655440091', '550e8400-e29b-41d4-a716-446655440034', 'Add search result highlighting', false),

    -- Email notifications subtasks
    ('550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440035', 'Setup email service', false),
    ('550e8400-e29b-41d4-a716-446655440093', '550e8400-e29b-41d4-a716-446655440035', 'Create email templates', false),
    ('550e8400-e29b-41d4-a716-446655440094', '550e8400-e29b-41d4-a716-446655440035', 'Implement notification preferences', false),

    -- Team collaboration features subtasks
    ('550e8400-e29b-41d4-a716-446655440095', '550e8400-e29b-41d4-a716-446655440036', 'Create chat interface', false),
    ('550e8400-e29b-41d4-a716-446655440096', '550e8400-e29b-41d4-a716-446655440036', 'Implement file sharing', false),
    ('550e8400-e29b-41d4-a716-446655440097', '550e8400-e29b-41d4-a716-446655440036', 'Add team activity feed', false),
    ('550e8400-e29b-41d4-a716-446655440098', '550e8400-e29b-41d4-a716-446655440036', 'Create team member directory', false),

    -- Data export functionality subtasks
    ('550e8400-e29b-41d4-a716-446655440099', '550e8400-e29b-41d4-a716-446655440037', 'Implement CSV export', false),
    ('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440037', 'Add PDF generation', false),
    ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440037', 'Create Excel export', false),

    -- Time tracking integration subtasks
    ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440038', 'Create time entry interface', false),
    ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440038', 'Implement time tracking widget', true),
    ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440038', 'Add time reports', false),

    -- Calendar integration subtasks
    ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440039', 'Setup calendar API integration', false),
    ('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440039', 'Create calendar view', false),
    ('550e8400-e29b-41d4-a716-446655440107', '550e8400-e29b-41d4-a716-446655440039', 'Sync with Google Calendar', false),

    -- Performance monitoring subtasks
    ('550e8400-e29b-41d4-a716-446655440108', '550e8400-e29b-41d4-a716-446655440026', 'Setup monitoring infrastructure', false),
    ('550e8400-e29b-41d4-a716-446655440109', '550e8400-e29b-41d4-a716-446655440026', 'Create performance dashboards', false),
    ('550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440026', 'Configure alerts and notifications', false),

    -- Data migration scripts subtasks
    ('550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440027', 'Analyze legacy data structure', false),
    ('550e8400-e29b-41d4-a716-446655440112', '550e8400-e29b-41d4-a716-446655440027', 'Write migration scripts', false),
    ('550e8400-e29b-41d4-a716-446655440113', '550e8400-e29b-41d4-a716-446655440027', 'Test data migration', false),
    ('550e8400-e29b-41d4-a716-446655440114', '550e8400-e29b-41d4-a716-446655440027', 'Validate migrated data', false),

    -- Security audit subtasks
    ('550e8400-e29b-41d4-a716-446655440115', '550e8400-e29b-41d4-a716-446655440028', 'Conduct vulnerability scan', true),
    ('550e8400-e29b-41d4-a716-446655440116', '550e8400-e29b-41d4-a716-446655440028', 'Review authentication security', false),
    ('550e8400-e29b-41d4-a716-446655440117', '550e8400-e29b-41d4-a716-446655440028', 'Test input validation', false),
    ('550e8400-e29b-41d4-a716-446655440118', '550e8400-e29b-41d4-a716-446655440028', 'Fix security vulnerabilities', false),

    -- Load testing subtasks
    ('550e8400-e29b-41d4-a716-446655440119', '550e8400-e29b-41d4-a716-446655440040', 'Setup load testing tools', false),
    ('550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440040', 'Create load test scenarios', false),
    ('550e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440040', 'Execute load tests', false),
    ('550e8400-e29b-41d4-a716-446655440122', '550e8400-e29b-41d4-a716-446655440040', 'Analyze performance results', false),

    -- User acceptance testing subtasks
    ('550e8400-e29b-41d4-a716-446655440123', '550e8400-e29b-41d4-a716-446655440041', 'Prepare UAT test cases', false),
    ('550e8400-e29b-41d4-a716-446655440124', '550e8400-e29b-41d4-a716-446655440041', 'Coordinate with stakeholders', false),
    ('550e8400-e29b-41d4-a716-446655440125', '550e8400-e29b-41d4-a716-446655440041', 'Execute UAT sessions', false),

    -- Documentation finalization subtasks
    ('550e8400-e29b-41d4-a716-446655440126', '550e8400-e29b-41d4-a716-446655440042', 'Write technical documentation', false),
    ('550e8400-e29b-41d4-a716-446655440127', '550e8400-e29b-41d4-a716-446655440042', 'Create user manual', true),
    ('550e8400-e29b-41d4-a716-446655440128', '550e8400-e29b-41d4-a716-446655440042', 'Update API documentation', false),
    ('550e8400-e29b-41d4-a716-446655440129', '550e8400-e29b-41d4-a716-446655440042', 'Review and finalize docs', false),

    -- Deployment automation subtasks
    ('550e8400-e29b-41d4-a716-446655440130', '550e8400-e29b-41d4-a716-446655440043', 'Setup CI/CD pipeline', false),
    ('550e8400-e29b-41d4-a716-446655440131', '550e8400-e29b-41d4-a716-446655440043', 'Configure deployment environments', false),
    ('550e8400-e29b-41d4-a716-446655440132', '550e8400-e29b-41d4-a716-446655440043', 'Test automated deployments', false),

    -- Beta release preparation subtasks
    ('550e8400-e29b-41d4-a716-446655440133', '550e8400-e29b-41d4-a716-446655440044', 'Create beta user onboarding', false),
    ('550e8400-e29b-41d4-a716-446655440134', '550e8400-e29b-41d4-a716-446655440044', 'Setup feedback collection', false),
    ('550e8400-e29b-41d4-a716-446655440135', '550e8400-e29b-41d4-a716-446655440044', 'Prepare beta release notes', false);

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