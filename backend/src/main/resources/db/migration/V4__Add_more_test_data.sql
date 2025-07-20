-- Additional test data migration to add 20 tasks and 50 subtasks for thorough testing

-- Additional tasks for Project Alpha (12 more tasks to reach 20 total)
INSERT INTO tasks (id, name, description, status, priority, assignee_id, project_id, created_by, due_date, estimated_hours, actual_hours) VALUES
    -- Sprint 1 tasks
    ('550e8400-e29b-41d4-a716-446655440029', 'Frontend routing setup', 'Configure React Router with protected routes and navigation guards', 'COMPLETED', 'HIGH', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-01-18', 12.0, 11.5),
    ('550e8400-e29b-41d4-a716-446655440030', 'State management implementation', 'Set up Zustand for global state management with TypeScript support', 'COMPLETED', 'HIGH', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-01-19', 8.0, 7.5),
    
    -- Sprint 2 tasks
    ('550e8400-e29b-41d4-a716-446655440031', 'Dashboard widgets development', 'Create reusable dashboard widgets for statistics and charts', 'IN_PROGRESS', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '2025-01-27', 16.0, 4.0),
    ('550e8400-e29b-41d4-a716-446655440032', 'File upload service', 'Implement file upload with drag-and-drop support and progress tracking', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440013', '2025-02-01', 12.0, NULL),
    ('550e8400-e29b-41d4-a716-446655440033', 'Email notification system', 'Set up email templates and notification service for task updates', 'TODO', 'LOW', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-05', 10.0, NULL),
    
    -- Sprint 3 tasks
    ('550e8400-e29b-41d4-a716-446655440034', 'Search functionality', 'Implement full-text search across tasks, projects, and users', 'TODO', 'HIGH', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '2025-02-08', 20.0, NULL),
    ('550e8400-e29b-41d4-a716-446655440035', 'Export functionality', 'Add export to CSV/PDF for reports and task lists', 'TODO', 'LOW', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '2025-02-10', 8.0, NULL),
    ('550e8400-e29b-41d4-a716-446655440036', 'Activity timeline', 'Create activity timeline component showing task history and changes', 'IN_PROGRESS', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440013', '2025-01-29', 14.0, 3.0),
    
    -- Backend optimization tasks
    ('550e8400-e29b-41d4-a716-446655440037', 'Caching implementation', 'Add Redis caching for frequently accessed data', 'TODO', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-02-12', 12.0, NULL),
    ('550e8400-e29b-41d4-a716-446655440038', 'API rate limiting', 'Implement rate limiting to prevent API abuse', 'TODO', 'HIGH', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-02-03', 6.0, NULL),
    ('550e8400-e29b-41d4-a716-446655440039', 'Webhook integration', 'Add webhook support for third-party integrations', 'PARKED', 'LOW', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', '2025-02-20', 16.0, NULL),
    ('550e8400-e29b-41d4-a716-446655440040', 'Backup automation', 'Set up automated database backups with retention policies', 'IN_PROGRESS', 'HIGH', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', '2025-01-25', 8.0, 2.0)
ON CONFLICT (id) DO NOTHING;

-- Add 50 subtasks distributed across all 20 tasks
INSERT INTO subtasks (id, task_id, name, is_completed, depends_on) VALUES
    -- Subtasks for Frontend routing setup (task 029)
    ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440029', 'Install React Router dependencies', true, NULL),
    ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440029', 'Create route configuration', true, '550e8400-e29b-41d4-a716-446655440101'),
    ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440029', 'Implement auth guards', true, '550e8400-e29b-41d4-a716-446655440102'),
    
    -- Subtasks for State management (task 030)
    ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440030', 'Install Zustand', true, NULL),
    ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440030', 'Create user store', true, '550e8400-e29b-41d4-a716-446655440104'),
    ('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440030', 'Create task store', true, '550e8400-e29b-41d4-a716-446655440104'),
    
    -- Subtasks for Dashboard widgets (task 031)
    ('550e8400-e29b-41d4-a716-446655440107', '550e8400-e29b-41d4-a716-446655440031', 'Design widget layouts', true, NULL),
    ('550e8400-e29b-41d4-a716-446655440108', '550e8400-e29b-41d4-a716-446655440031', 'Create stats card component', true, '550e8400-e29b-41d4-a716-446655440107'),
    ('550e8400-e29b-41d4-a716-446655440109', '550e8400-e29b-41d4-a716-446655440031', 'Implement chart components', false, '550e8400-e29b-41d4-a716-446655440107'),
    ('550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440031', 'Add real-time updates', false, '550e8400-e29b-41d4-a716-446655440109'),
    
    -- Subtasks for File upload service (task 032)
    ('550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440032', 'Research file upload libraries', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440112', '550e8400-e29b-41d4-a716-446655440032', 'Implement drag-and-drop zone', false, '550e8400-e29b-41d4-a716-446655440111'),
    ('550e8400-e29b-41d4-a716-446655440113', '550e8400-e29b-41d4-a716-446655440032', 'Add progress tracking', false, '550e8400-e29b-41d4-a716-446655440112'),
    ('550e8400-e29b-41d4-a716-446655440114', '550e8400-e29b-41d4-a716-446655440032', 'Implement file validation', false, '550e8400-e29b-41d4-a716-446655440112'),
    
    -- Subtasks for Email notification (task 033)
    ('550e8400-e29b-41d4-a716-446655440115', '550e8400-e29b-41d4-a716-446655440033', 'Set up email service provider', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440116', '550e8400-e29b-41d4-a716-446655440033', 'Create email templates', false, '550e8400-e29b-41d4-a716-446655440115'),
    ('550e8400-e29b-41d4-a716-446655440117', '550e8400-e29b-41d4-a716-446655440033', 'Implement notification queue', false, '550e8400-e29b-41d4-a716-446655440115'),
    
    -- Subtasks for Search functionality (task 034)
    ('550e8400-e29b-41d4-a716-446655440118', '550e8400-e29b-41d4-a716-446655440034', 'Design search UI', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440119', '550e8400-e29b-41d4-a716-446655440034', 'Implement search API', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440034', 'Add search filters', false, '550e8400-e29b-41d4-a716-446655440119'),
    ('550e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440034', 'Implement search suggestions', false, '550e8400-e29b-41d4-a716-446655440119'),
    
    -- Subtasks for Export functionality (task 035)
    ('550e8400-e29b-41d4-a716-446655440122', '550e8400-e29b-41d4-a716-446655440035', 'Create export templates', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440123', '550e8400-e29b-41d4-a716-446655440035', 'Implement CSV export', false, '550e8400-e29b-41d4-a716-446655440122'),
    ('550e8400-e29b-41d4-a716-446655440124', '550e8400-e29b-41d4-a716-446655440035', 'Implement PDF export', false, '550e8400-e29b-41d4-a716-446655440122'),
    
    -- Subtasks for Activity timeline (task 036)
    ('550e8400-e29b-41d4-a716-446655440125', '550e8400-e29b-41d4-a716-446655440036', 'Design timeline component', true, NULL),
    ('550e8400-e29b-41d4-a716-446655440126', '550e8400-e29b-41d4-a716-446655440036', 'Create activity data model', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440127', '550e8400-e29b-41d4-a716-446655440036', 'Implement timeline rendering', false, '550e8400-e29b-41d4-a716-446655440125'),
    
    -- Subtasks for Caching implementation (task 037)
    ('550e8400-e29b-41d4-a716-446655440128', '550e8400-e29b-41d4-a716-446655440037', 'Install Redis', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440129', '550e8400-e29b-41d4-a716-446655440037', 'Configure Redis connection', false, '550e8400-e29b-41d4-a716-446655440128'),
    ('550e8400-e29b-41d4-a716-446655440130', '550e8400-e29b-41d4-a716-446655440037', 'Implement cache layer', false, '550e8400-e29b-41d4-a716-446655440129'),
    
    -- Subtasks for API rate limiting (task 038)
    ('550e8400-e29b-41d4-a716-446655440131', '550e8400-e29b-41d4-a716-446655440038', 'Choose rate limiting strategy', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440132', '550e8400-e29b-41d4-a716-446655440038', 'Implement rate limiter', false, '550e8400-e29b-41d4-a716-446655440131'),
    
    -- Subtasks for Webhook integration (task 039)
    ('550e8400-e29b-41d4-a716-446655440133', '550e8400-e29b-41d4-a716-446655440039', 'Design webhook API', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440134', '550e8400-e29b-41d4-a716-446655440039', 'Implement webhook endpoints', false, '550e8400-e29b-41d4-a716-446655440133'),
    
    -- Subtasks for Backup automation (task 040)
    ('550e8400-e29b-41d4-a716-446655440135', '550e8400-e29b-41d4-a716-446655440040', 'Create backup scripts', true, NULL),
    ('550e8400-e29b-41d4-a716-446655440136', '550e8400-e29b-41d4-a716-446655440040', 'Set up cron jobs', false, '550e8400-e29b-41d4-a716-446655440135'),
    
    -- Additional subtasks for existing tasks with dependencies
    ('550e8400-e29b-41d4-a716-446655440137', '550e8400-e29b-41d4-a716-446655440021', 'Create spacing system', false, '550e8400-e29b-41d4-a716-446655440032'),
    ('550e8400-e29b-41d4-a716-446655440138', '550e8400-e29b-41d4-a716-446655440021', 'Design icon library', false, '550e8400-e29b-41d4-a716-446655440033'),
    
    ('550e8400-e29b-41d4-a716-446655440139', '550e8400-e29b-41d4-a716-446655440022', 'Test performance endpoints', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440140', '550e8400-e29b-41d4-a716-446655440022', 'Create test documentation', false, '550e8400-e29b-41d4-a716-446655440037'),
    
    ('550e8400-e29b-41d4-a716-446655440141', '550e8400-e29b-41d4-a716-446655440024', 'Analyze slow queries', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440142', '550e8400-e29b-41d4-a716-446655440024', 'Create missing indexes', false, '550e8400-e29b-41d4-a716-446655440141'),
    ('550e8400-e29b-41d4-a716-446655440143', '550e8400-e29b-41d4-a716-446655440024', 'Optimize JOIN queries', false, '550e8400-e29b-41d4-a716-446655440141'),
    
    ('550e8400-e29b-41d4-a716-446655440144', '550e8400-e29b-41d4-a716-446655440025', 'Test on iOS devices', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440145', '550e8400-e29b-41d4-a716-446655440025', 'Test on Android devices', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440146', '550e8400-e29b-41d4-a716-446655440025', 'Fix responsive issues', false, '550e8400-e29b-41d4-a716-446655440144'),
    
    ('550e8400-e29b-41d4-a716-446655440147', '550e8400-e29b-41d4-a716-446655440026', 'Select monitoring tools', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440148', '550e8400-e29b-41d4-a716-446655440026', 'Configure alerts', false, '550e8400-e29b-41d4-a716-446655440147'),
    
    ('550e8400-e29b-41d4-a716-446655440149', '550e8400-e29b-41d4-a716-446655440027', 'Map legacy data schema', false, NULL),
    ('550e8400-e29b-41d4-a716-446655440150', '550e8400-e29b-41d4-a716-446655440027', 'Write migration scripts', false, '550e8400-e29b-41d4-a716-446655440149')
ON CONFLICT (id) DO NOTHING;

-- Add more comments to show activity
INSERT INTO comments (id, task_id, user_id, content) VALUES
    ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440011', 'Great work on the routing setup! The protected routes are working perfectly.'),
    ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440014', 'The dashboard widgets look amazing! Can we add animation transitions?'),
    ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440015', 'Timeline component is coming along nicely. Need help with the date formatting?'),
    ('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440016', 'Backup scripts are ready. Testing the cron configuration now.')
ON CONFLICT (id) DO NOTHING;

-- Add more time entries to show realistic project activity
INSERT INTO time_entries (id, user_id, task_id, hours, date, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440029', 6.0, '2025-01-17', 'Set up React Router configuration'),
    ('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440029', 5.5, '2025-01-18', 'Implemented protected routes'),
    ('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440030', 4.0, '2025-01-18', 'Zustand setup and configuration'),
    ('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440030', 3.5, '2025-01-19', 'Created store implementations'),
    ('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440031', 4.0, '2025-01-20', 'Dashboard widget designs'),
    ('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440040', 2.0, '2025-01-19', 'Backup strategy planning')
ON CONFLICT (id) DO NOTHING;

-- Update task tags using the array column
UPDATE tasks SET tags = ARRAY['frontend', 'routing', 'completed'] WHERE id = '550e8400-e29b-41d4-a716-446655440029';
UPDATE tasks SET tags = ARRAY['frontend', 'state-management', 'completed'] WHERE id = '550e8400-e29b-41d4-a716-446655440030';
UPDATE tasks SET tags = ARRAY['frontend', 'ui', 'dashboard'] WHERE id = '550e8400-e29b-41d4-a716-446655440031';
UPDATE tasks SET tags = ARRAY['frontend', 'upload', 'feature'] WHERE id = '550e8400-e29b-41d4-a716-446655440032';
UPDATE tasks SET tags = ARRAY['backend', 'notifications', 'email'] WHERE id = '550e8400-e29b-41d4-a716-446655440033';
UPDATE tasks SET tags = ARRAY['backend', 'search', 'feature'] WHERE id = '550e8400-e29b-41d4-a716-446655440034';
UPDATE tasks SET tags = ARRAY['backend', 'export', 'reports'] WHERE id = '550e8400-e29b-41d4-a716-446655440035';
UPDATE tasks SET tags = ARRAY['frontend', 'timeline', 'ui'] WHERE id = '550e8400-e29b-41d4-a716-446655440036';
UPDATE tasks SET tags = ARRAY['backend', 'performance', 'redis'] WHERE id = '550e8400-e29b-41d4-a716-446655440037';
UPDATE tasks SET tags = ARRAY['backend', 'security', 'api'] WHERE id = '550e8400-e29b-41d4-a716-446655440038';
UPDATE tasks SET tags = ARRAY['backend', 'integration', 'webhooks'] WHERE id = '550e8400-e29b-41d4-a716-446655440039';
UPDATE tasks SET tags = ARRAY['devops', 'backup', 'automation'] WHERE id = '550e8400-e29b-41d4-a716-446655440040';