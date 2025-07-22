-- Create team_availability table for tracking team member availability
CREATE TABLE IF NOT EXISTS team_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT availability_status_check CHECK (status IN ('AVAILABLE', 'BUSY', 'OUT_OF_OFFICE', 'HOLIDAY', 'SICK_LEAVE')),
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- Add indexes for better query performance
CREATE INDEX idx_team_availability_user_id ON team_availability(user_id);
CREATE INDEX idx_team_availability_date ON team_availability(date);
CREATE INDEX idx_team_availability_status ON team_availability(status);
CREATE INDEX idx_team_availability_date_range ON team_availability(date, user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_team_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER team_availability_updated_at_trigger
    BEFORE UPDATE ON team_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_team_availability_updated_at();