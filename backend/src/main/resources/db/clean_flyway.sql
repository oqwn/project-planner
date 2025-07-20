-- Script to clean Flyway history if needed
-- Run this manually if you want to reset migrations

-- Drop all tables and start fresh
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Grant permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;