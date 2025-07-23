-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    host_id UUID NOT NULL,
    host_name VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration INTEGER DEFAULT 60, -- Duration in minutes
    code VARCHAR(10) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    project_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_meeting_host FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_meeting_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Create index for faster lookups
CREATE INDEX idx_meetings_code ON meetings(code);
CREATE INDEX idx_meetings_host_id ON meetings(host_id);
CREATE INDEX idx_meetings_project_id ON meetings(project_id);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);