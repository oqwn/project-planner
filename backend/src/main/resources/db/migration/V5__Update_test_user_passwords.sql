-- Update test users with valid BCrypt hashes
-- All test users will have the password: password123

-- This is a proper BCrypt hash for "password123" 
-- Generated with BCrypt rounds=10
UPDATE users SET password_hash = '$2a$10$3R4VMcgep8JtKo0D70RUL.Zgr39eKJ49yTdIF.4vrt29lkD63MPk.' 
WHERE email IN (
    'sarah.chen@example.com',
    'mike.johnson@example.com',
    'emily.davis@example.com',
    'john.doe@example.com',
    'lisa.wang@example.com',
    'tom.wilson@example.com'
);

-- Add an admin user for testing
-- Email: admin@example.com
-- Password: admin123
INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440099', 'admin@example.com', 'Admin User', '$2a$10$yCs3qA7Xx5/kaTPJW4iq..2QImwSLiOGnNXCvMbdTnJhuS3mnRedW', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Document the test credentials in comments
-- Test User Credentials:
-- sarah.chen@example.com / password123 (TEAM_LEAD)
-- mike.johnson@example.com / password123 (MEMBER)
-- emily.davis@example.com / password123 (MEMBER)
-- john.doe@example.com / password123 (PROJECT_MANAGER)
-- lisa.wang@example.com / password123 (MEMBER)
-- tom.wilson@example.com / password123 (MEMBER)
-- admin@example.com / admin123 (ADMIN)