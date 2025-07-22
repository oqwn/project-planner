-- Fix milestones table creation issue
-- Drop the table if it exists in a broken state and recreate it

DROP TABLE IF EXISTS milestones CASCADE;

-- Create milestones table for project milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT milestone_status_check CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'))
);

-- Add indexes for better query performance
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_milestones_target_date ON milestones(target_date);
CREATE INDEX idx_milestones_status ON milestones(status);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_milestones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER milestones_updated_at_trigger
    BEFORE UPDATE ON milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_milestones_updated_at();