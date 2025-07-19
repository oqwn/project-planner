-- Insert sample projects if not exists
INSERT INTO projects (id, name, description, start_date, end_date, created_at, updated_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Project Alpha', 'Main product development project', '2025-01-01', '2025-06-30', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440002', 'Beta Release', 'Beta testing and release preparation', '2025-01-15', '2025-03-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Insert sample users with different roles
INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440011', 'sarah.chen@example.com', 'Sarah Chen', '$2a$10$dummyhash1', 'TEAM_LEAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440012', 'mike.johnson@example.com', 'Mike Johnson', '$2a$10$dummyhash2', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440013', 'emily.davis@example.com', 'Emily Davis', '$2a$10$dummyhash3', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440014', 'john.doe@example.com', 'John Doe', '$2a$10$dummyhash4', 'PROJECT_MANAGER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440015', 'lisa.wang@example.com', 'Lisa Wang', '$2a$10$dummyhash5', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440016', 'tom.wilson@example.com', 'Tom Wilson', '$2a$10$dummyhash6', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, assignee_id, project_id, created_by, due_date, estimated_hours, actual_hours) VALUES
    ('550e8400-e29b-41d4-a716-446655440021', 'Design system implementation', 'Create a comprehensive design system with reusable components, color palette, and typography guidelines.', 'in-progress', 'high', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-01-25', 16.0, 8.0),
    ('550e8400-e29b-41d4-a716-446655440022', 'API integration testing', 'Comprehensive testing of all API endpoints with error handling and edge cases.', 'todo', 'medium', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440013', '2025-01-23', 12.0, NULL),
    ('550e8400-e29b-41d4-a716-446655440023', 'User authentication flow', 'Implement secure user login, registration, and password reset functionality.', 'completed', 'high', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-01-20', 20.0, 18.0),
    ('550e8400-e29b-41d4-a716-446655440024', 'Database optimization', 'Optimize database queries and add proper indexing for better performance.', 'parked', 'low', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', '2025-01-28', 8.0, NULL),
    ('550e8400-e29b-41d4-a716-446655440025', 'Mobile responsiveness', 'Ensure the application works perfectly on mobile devices and tablets.', 'in-progress', 'medium', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '2025-01-26', 14.0, 6.0),
    ('550e8400-e29b-41d4-a716-446655440026', 'Performance monitoring setup', 'Set up monitoring and alerting for application performance metrics.', 'todo', 'high', '550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-01-22', 10.0, NULL),
    ('550e8400-e29b-41d4-a716-446655440027', 'Data migration scripts', 'Create scripts for migrating data from legacy system.', 'todo', 'medium', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-01-30', 15.0, NULL),
    ('550e8400-e29b-41d4-a716-446655440028', 'Security audit', 'Conduct comprehensive security audit and fix vulnerabilities.', 'in-progress', 'high', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-01-24', 20.0, 5.0)
ON CONFLICT (id) DO NOTHING;

-- Insert subtasks
INSERT INTO subtasks (id, task_id, title, completed, position) VALUES
    ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', 'Create color palette', true, 1),
    ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440021', 'Design typography system', true, 2),
    ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440021', 'Build component library', false, 3),
    ('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440021', 'Document usage guidelines', false, 4),
    
    ('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440022', 'Test user authentication endpoints', false, 1),
    ('550e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440022', 'Test task management APIs', false, 2),
    ('550e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440022', 'Test error handling', false, 3),
    
    ('550e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440023', 'Design login page', true, 1),
    ('550e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440023', 'Implement JWT authentication', true, 2),
    ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440023', 'Add password reset', true, 3),
    ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440023', 'Add form validation', true, 4)
ON CONFLICT (id) DO NOTHING;

-- Insert task comments
INSERT INTO task_comments (id, task_id, user_id, content) VALUES
    ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440012', 'Great progress on the color palette! The accessibility ratios look good.'),
    ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440014', 'Authentication is working perfectly! Great job on the security implementation.'),
    ('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440011', 'Please prioritize mobile navigation menu - it''s critical for user experience.'),
    ('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440014', 'Found some XSS vulnerabilities in the form inputs. Working on fixes now.')
ON CONFLICT (id) DO NOTHING;

-- Insert task attachments
INSERT INTO task_attachments (id, task_id, filename, file_type, file_size, file_url, uploaded_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440021', 'design-system-mockups.fig', 'figma', 2048000, '/files/design-system-mockups.fig', '550e8400-e29b-41d4-a716-446655440011'),
    ('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440023', 'auth-flow-diagram.pdf', 'pdf', 512000, '/files/auth-flow-diagram.pdf', '550e8400-e29b-41d4-a716-446655440013'),
    ('550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440028', 'security-audit-report.docx', 'docx', 1024000, '/files/security-audit-report.docx', '550e8400-e29b-41d4-a716-446655440013')
ON CONFLICT (id) DO NOTHING;

-- Insert task tags
INSERT INTO task_tags (id, task_id, tag) VALUES
    ('550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440021', 'design'),
    ('550e8400-e29b-41d4-a716-446655440072', '550e8400-e29b-41d4-a716-446655440021', 'frontend'),
    ('550e8400-e29b-41d4-a716-446655440073', '550e8400-e29b-41d4-a716-446655440021', 'ui'),
    ('550e8400-e29b-41d4-a716-446655440074', '550e8400-e29b-41d4-a716-446655440022', 'backend'),
    ('550e8400-e29b-41d4-a716-446655440075', '550e8400-e29b-41d4-a716-446655440022', 'testing'),
    ('550e8400-e29b-41d4-a716-446655440076', '550e8400-e29b-41d4-a716-446655440022', 'api'),
    ('550e8400-e29b-41d4-a716-446655440077', '550e8400-e29b-41d4-a716-446655440023', 'security'),
    ('550e8400-e29b-41d4-a716-446655440078', '550e8400-e29b-41d4-a716-446655440023', 'frontend'),
    ('550e8400-e29b-41d4-a716-446655440079', '550e8400-e29b-41d4-a716-446655440023', 'backend')
ON CONFLICT (id) DO NOTHING;

-- Insert sample time entries for dashboard
INSERT INTO time_entries (id, user_id, project_id, task_id, hours_worked, work_date, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 4.5, '2025-01-19', 'Worked on color palette and accessibility'),
    ('550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 3.5, '2025-01-18', 'Typography system design'),
    ('550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440023', 8.0, '2025-01-17', 'JWT implementation and testing'),
    ('550e8400-e29b-41d4-a716-446655440084', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440023', 10.0, '2025-01-16', 'Login page design and form validation'),
    ('550e8400-e29b-41d4-a716-446655440085', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440025', 6.0, '2025-01-19', 'Responsive dashboard layout')
ON CONFLICT (id) DO NOTHING;

-- Add sample reminders
INSERT INTO task_reminders (id, task_id, user_id, reminder_datetime, message) VALUES
    ('550e8400-e29b-41d4-a716-446655440091', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440012', '2025-01-22 10:00:00', 'API testing deadline approaching'),
    ('550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440016', '2025-01-21 14:00:00', 'Start performance monitoring setup')
ON CONFLICT (id) DO NOTHING;