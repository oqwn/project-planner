-- Create project_members table to track which users belong to which projects
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER', -- PROJECT_OWNER, PROJECT_MANAGER, MEMBER, VIEWER
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    invited_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    
    -- Ensure a user can only be added once to a project
    UNIQUE(project_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_project_members_active ON project_members(project_id, is_active);

-- Add the project creator as the first member with PROJECT_OWNER role
INSERT INTO project_members (project_id, user_id, role, invited_by)
SELECT 
    p.id as project_id,
    p.created_by as user_id,
    'PROJECT_OWNER' as role,
    p.created_by as invited_by
FROM projects p
WHERE NOT EXISTS (
    SELECT 1 FROM project_members pm 
    WHERE pm.project_id = p.id AND pm.user_id = p.created_by
);

-- Add all users who have tasks assigned in a project as members
INSERT INTO project_members (project_id, user_id, role, invited_by)
SELECT DISTINCT 
    t.project_id,
    t.assignee_id as user_id,
    'MEMBER' as role,
    p.created_by as invited_by
FROM tasks t
JOIN projects p ON t.project_id = p.id
WHERE t.assignee_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM project_members pm 
    WHERE pm.project_id = t.project_id AND pm.user_id = t.assignee_id
);

-- Add comment about the migration
COMMENT ON TABLE project_members IS 'Tracks which users are members of which projects and their roles';
COMMENT ON COLUMN project_members.role IS 'User role within the project: PROJECT_OWNER, PROJECT_MANAGER, MEMBER, VIEWER';
COMMENT ON COLUMN project_members.is_active IS 'Whether the user is still an active member of the project';