# Test User Credentials

After running the application, you can login with the following test accounts:

## Regular Users (Password: password123)

| Email | Name | Role | Password |
|-------|------|------|----------|
| sarah.chen@example.com | Sarah Chen | TEAM_LEAD | password123 |
| mike.johnson@example.com | Mike Johnson | MEMBER | password123 |
| emily.davis@example.com | Emily Davis | MEMBER | password123 |
| john.doe@example.com | John Doe | PROJECT_MANAGER | password123 |
| lisa.wang@example.com | Lisa Wang | MEMBER | password123 |
| tom.wilson@example.com | Tom Wilson | MEMBER | password123 |

## Admin User

| Email | Name | Role | Password |
|-------|------|------|----------|
| admin@example.com | Admin User | ADMIN | admin123 |

## How to Use

1. Start the backend: `cd backend && mvn spring-boot:run`
2. Start the frontend: `cd frontend && pnpm dev`
3. Navigate to http://localhost:5173
4. Use any of the credentials above to login

## Notes

- All test users have pre-assigned tasks and projects
- The PROJECT_MANAGER (john.doe@example.com) has created most of the projects
- The TEAM_LEAD (sarah.chen@example.com) has several tasks assigned
- You can also register new accounts through the registration page