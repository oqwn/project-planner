-- V19: Populate default team availability for all users
-- Available Monday-Friday, Holiday Saturday-Sunday

-- Function to populate availability for a date range
DO $$
DECLARE
    user_record RECORD;
    date_record DATE;
    start_date DATE := CURRENT_DATE;
    end_date DATE := CURRENT_DATE + INTERVAL '2 years';
    day_of_week INTEGER;
    availability_status VARCHAR(50);
BEGIN
    -- Loop through all users
    FOR user_record IN 
        SELECT id FROM users
    LOOP
        -- Loop through each date in the range
        date_record := start_date;
        WHILE date_record <= end_date LOOP
            -- Get day of week (1 = Monday, 7 = Sunday)
            day_of_week := EXTRACT(ISODOW FROM date_record);
            
            -- Set status based on day of week
            IF day_of_week <= 5 THEN
                -- Monday to Friday: Available
                availability_status := 'AVAILABLE';
            ELSE
                -- Saturday and Sunday: Holiday
                availability_status := 'HOLIDAY';
            END IF;
            
            -- Insert availability record (ignore if already exists)
            INSERT INTO team_availability (user_id, date, status, notes)
            VALUES (user_record.id, date_record, availability_status, 'Default schedule')
            ON CONFLICT (user_id, date) DO NOTHING;
            
            -- Move to next date
            date_record := date_record + INTERVAL '1 day';
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Default team availability populated for % users from % to %', 
        (SELECT COUNT(*) FROM users), start_date, end_date;
END $$;

-- Create index for better performance on date range queries
CREATE INDEX IF NOT EXISTS idx_team_availability_date_status 
ON team_availability (date, status);

-- Create index for user + date queries
CREATE INDEX IF NOT EXISTS idx_team_availability_user_date 
ON team_availability (user_id, date);