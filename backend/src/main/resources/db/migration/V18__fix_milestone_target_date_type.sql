-- Fix milestone target_date column type from DATE to TIMESTAMP WITH TIME ZONE
-- This addresses the issue where PostgreSQL cannot convert DATE to OffsetDateTime

-- Change target_date column type to TIMESTAMP WITH TIME ZONE
ALTER TABLE milestones 
ALTER COLUMN target_date TYPE TIMESTAMP WITH TIME ZONE 
USING target_date::timestamp AT TIME ZONE 'UTC';