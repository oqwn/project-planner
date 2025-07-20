# Project Management Application - Architecture Document

## Overview
This document outlines the technical architecture for a comprehensive project management application that supports task management, time tracking, collaboration, reporting, and team management features.

## Technology Stack

### Frontend ✅ IMPLEMENTED
- **Framework**: React.js 19.2.0-canary (latest) ✅
- **Package Manager**: pnpm ✅
- **Build Tool**: Vite ✅
- **Language**: TypeScript ✅
- **Code Quality**: ESLint + Prettier ✅
- **UI Library**: Material-UI or Ant Design (TBD)
- **State Management**: Redux Toolkit or Zustand (TBD)
- **Routing**: React Router v6 (TBD)
- **Styling**: CSS Modules / Styled Components / Tailwind CSS (TBD)
- **Charts**: Chart.js or D3.js for Gantt charts (TBD)
- **Drag & Drop**: react-beautiful-dnd or @dnd-kit (TBD)
- **Real-time**: Socket.io-client or WebSockets (TBD)
- **HTTP Client**: Axios or Fetch API (TBD)
- **Form Handling**: React Hook Form (TBD)
- **Date Handling**: date-fns or dayjs (TBD)

### Backend ✅ IMPLEMENTED
- **Runtime**: Java 21 ✅
- **Framework**: Spring Boot 3.4.5 ✅
- **Build Tool**: Maven ✅
- **Port**: 20005 ✅ (updated from 20003)
- **CORS**: Configured for localhost:5173 ✅
- **DevTools**: Enabled for hot reload ✅
- **API**: REST with OpenAPI/Swagger documentation (TBD)
- **Authentication**: Spring Security with JWT (TBD)
- **Database Access**: Spring Data JPA (TBD)
- **Real-time**: Spring WebSocket with STOMP (TBD)
- **Task Queue**: Spring Batch or RabbitMQ (TBD)
- **Caching**: Spring Cache with Redis (TBD)
- **Validation**: Bean Validation (JSR-303) (TBD)
- **Logging**: SLF4J with Logback (TBD)

### Database ✅ IMPLEMENTED
- **Primary Database**: PostgreSQL ✅
- **ORM**: MyBatis (instead of JPA) ✅
- **Migrations**: Flyway ✅
- **Connection Pooling**: HikariCP ✅
- **Views**: dashboard_stats, recent_activities for optimized queries ✅
- **Caching Layer**: Redis (TBD)
- **File Storage**: AWS S3 or local storage with MinIO (TBD)

### DevOps & Infrastructure ✅ IMPLEMENTED
- **Containerization**: Docker ✅
- **Container Orchestration**: Docker Compose (dev) ✅, Kubernetes (prod) (TBD)
- **CI/CD**: GitHub Actions ✅
- **Development Environment**: Hot-reload for both frontend and backend ✅
- **Package Management**: pnpm with lockfile ✅
- **Monitoring**: Prometheus + Grafana + Spring Boot Actuator (TBD)
- **Logging**: SLF4J/Logback + ELK Stack (TBD)
- **Frontend Testing**: Jest, React Testing Library, Cypress (TBD)
- **Backend Testing**: JUnit 5, Mockito, Spring Boot Test, RestAssured (TBD)

## Current Implementation Status

### ✅ Completed Infrastructure
- **Project Structure**: Monorepo with separate frontend/backend directories
- **Frontend**: React 19.2.0-canary + TypeScript + Vite + pnpm setup complete
- **Backend**: Spring Boot 3.4.5 + Java 21 + Maven setup complete
- **Development Environment**: Docker Compose with PostgreSQL
- **CI/CD**: GitHub Actions workflows for testing and building
- **Code Quality**: ESLint + Prettier configuration
- **Git Setup**: Comprehensive .gitignore and workflows
- **Documentation**: README, architecture, and todo tracking

### 🔄 Next Implementation Steps
1. **Database Setup**: PostgreSQL connection and JPA configuration
2. **API Layer**: REST endpoints with OpenAPI documentation
3. **Security**: Spring Security with JWT authentication
4. **Frontend UI**: Component library selection and setup
5. **State Management**: Redux Toolkit or Zustand integration

### 📁 Current Project Structure
```
project-planner/
├── frontend/                    # React 19.2.0-canary application (port 5173)
│   ├── src/
│   ├── package.json            # pnpm dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript config
│   ├── eslint.config.js        # ESLint + Prettier
│   └── Dockerfile              # Development container
├── backend/                     # Spring Boot application (port 20005)
│   ├── src/main/java/          # Java source code
│   ├── src/main/resources/     # Application properties
│   ├── pom.xml                 # Maven dependencies
│   └── Dockerfile              # Development container
├── docker-compose.yml          # Multi-service development setup
├── docker-compose.dev.yml      # Development overrides
├── .github/workflows/          # CI/CD pipelines
└── README.md                   # Project documentation
```

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Web Application (React/Vue)  │  Mobile App (React Native)      │
└────────────────┬───────────────┴────────────────┬───────────────┘
                 │                                │
                 ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (nginx)                        │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                           │
├─────────────────┬───────────────┬───────────────┬──────────────┤
│   Auth Service  │  Task Service │ Time Service  │ Chat Service │
├─────────────────┼───────────────┼───────────────┼──────────────┤
│ Report Service  │ Notification   │ File Service  │ User Service │
│                 │    Service      │               │              │
└─────────────────┴───────────────┴───────────────┴──────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                │
├─────────────────┬───────────────┬───────────────┬──────────────┤
│   PostgreSQL    │     Redis      │   File Store  │ Message Queue│
└─────────────────┴───────────────┴───────────────┴──────────────┘
```

## Database Schema

### Core Tables

```sql
-- Users table
users {
  id: UUID PK
  email: string unique
  name: string
  password_hash: string
  role: enum [admin, project_manager, team_lead, member, viewer]
  interests: text[]
  associations: text[]
  created_at: timestamp
  updated_at: timestamp
}

-- Projects table
projects {
  id: UUID PK
  name: string
  description: text
  start_date: date
  end_date: date
  status: enum [planning, active, completed, archived]
  created_by: UUID FK users
  created_at: timestamp
  updated_at: timestamp
}

-- Tasks table
tasks {
  id: UUID PK
  project_id: UUID FK projects
  name: string
  description: text
  assignee_id: UUID FK users
  status: enum [todo, in_progress, completed, parked]
  priority: enum [high, medium, low]
  due_date: date
  estimated_hours: decimal
  created_by: UUID FK users
  created_at: timestamp
  updated_at: timestamp
}

-- Subtasks table
subtasks {
  id: UUID PK
  task_id: UUID FK tasks
  name: string
  is_completed: boolean
  depends_on: UUID FK subtasks nullable
  created_at: timestamp
}

-- Time entries table
time_entries {
  id: UUID PK
  task_id: UUID FK tasks
  user_id: UUID FK users
  date: date
  hours: decimal
  description: text
  created_at: timestamp
}

-- Comments table
comments {
  id: UUID PK
  task_id: UUID FK tasks
  user_id: UUID FK users
  content: text
  mentions: UUID[] FK users
  created_at: timestamp
}

-- Milestones table
milestones {
  id: UUID PK
  project_id: UUID FK projects
  name: string
  due_date: date
  status: enum [pending, achieved, missed]
  created_at: timestamp
}

-- Notifications table
notifications {
  id: UUID PK
  user_id: UUID FK users
  type: enum [task_due, comment_mention, milestone_approaching]
  entity_type: string
  entity_id: UUID
  message: string
  is_read: boolean
  created_at: timestamp
}

-- Team availability table
team_availability {
  id: UUID PK
  user_id: UUID FK users
  date: date
  status: enum [available, tentative, unavailable]
  created_at: timestamp
}

-- Chat messages table
chat_messages {
  id: UUID PK
  project_id: UUID FK projects
  user_id: UUID FK users
  content: text
  mentions: UUID[] FK users
  created_at: timestamp
}

-- Files table
files {
  id: UUID PK
  project_id: UUID FK projects
  uploaded_by: UUID FK users
  filename: string
  file_path: string
  file_size: bigint
  mime_type: string
  created_at: timestamp
}
```

## API Design

### RESTful Endpoints

```
Authentication:
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

Projects:
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

Tasks:
GET    /api/projects/:projectId/tasks
POST   /api/projects/:projectId/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/status

Subtasks:
GET    /api/tasks/:taskId/subtasks
POST   /api/tasks/:taskId/subtasks
PUT    /api/subtasks/:id
DELETE /api/subtasks/:id

Time Tracking:
GET    /api/time-entries
POST   /api/time-entries
DELETE /api/time-entries/:id

Comments:
GET    /api/tasks/:taskId/comments
POST   /api/tasks/:taskId/comments

Notifications:
GET    /api/notifications
PATCH  /api/notifications/:id/read

Reports:
GET    /api/projects/:projectId/gantt
GET    /api/projects/:projectId/workload
GET    /api/projects/:projectId/milestones

Team:
GET    /api/teams/:projectId/members
PUT    /api/teams/:projectId/members/:userId/role
GET    /api/teams/availability
POST   /api/teams/availability
```

### WebSocket Events

```javascript
// Client to Server
socket.emit('join-project', projectId)
socket.emit('leave-project', projectId)
socket.emit('send-message', { projectId, content })
socket.emit('task-update', { taskId, updates })

// Server to Client
socket.on('new-message', message)
socket.on('task-updated', task)
socket.on('user-joined', user)
socket.on('user-left', user)
```

## Security Architecture

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Permission matrix for fine-grained access
- Session management with Redis
- Password hashing with bcrypt

### API Security
- Rate limiting per endpoint
- Request validation and sanitization
- CORS configuration
- HTTPS enforcement
- API key for external integrations

### Data Security
- Encryption at rest for sensitive data
- Encryption in transit (TLS 1.3)
- Database connection pooling
- SQL injection prevention via parameterized queries
- XSS protection with content security policy

## Performance Optimization

### Frontend
- Code splitting and lazy loading
- Component memoization
- Virtual scrolling for large lists
- Image optimization and lazy loading
- Service worker for offline capability
- Browser caching strategies

### Backend
- Database query optimization with indexes
- Redis caching for frequently accessed data
- Connection pooling
- Horizontal scaling with load balancer
- Background job processing for heavy tasks
- GraphQL query complexity limiting

### Database
- Proper indexing strategy
- Query optimization
- Partitioning for large tables
- Read replicas for reporting
- Connection pooling
- Regular vacuum and analyze

## Scalability Considerations

### Microservices Architecture
- Service separation by domain
- Independent deployment
- Service mesh for inter-service communication
- Circuit breakers for fault tolerance
- Event-driven architecture with message queues

### Caching Strategy
- Redis for session storage
- Database query result caching
- CDN for static assets
- Browser caching headers
- API response caching

### Load Handling
- Horizontal scaling with Kubernetes
- Auto-scaling based on metrics
- Load balancing with health checks
- Queue-based task processing
- Database connection pooling

## Monitoring & Logging

### Application Monitoring
- Prometheus metrics collection
- Grafana dashboards
- Custom business metrics
- Performance monitoring
- Error tracking with Sentry

### Logging
- Centralized logging with ELK stack
- Structured logging format
- Log levels and filtering
- Request tracing with correlation IDs
- Audit logging for compliance

### Alerting
- Threshold-based alerts
- Anomaly detection
- PagerDuty integration
- Slack notifications
- Email alerts

## Development Workflow

### Version Control
- Git with feature branch workflow
- Semantic versioning
- Commit message conventions
- Code review process
- Protected main branch

### CI/CD Pipeline
```yaml
stages:
  - lint
  - test
  - build
  - security-scan
  - deploy-staging
  - integration-tests
  - deploy-production
```

### Testing Strategy
- Unit tests (80% coverage target)
- Integration tests for APIs
- E2E tests for critical paths
- Performance testing
- Security testing
- Accessibility testing

## Deployment Architecture

### Container Strategy
- Docker containers for all services
- Multi-stage builds for optimization
- Container registry for image storage
- Kubernetes for orchestration
- Helm charts for deployment

### Environment Setup
- Development: Docker Compose
- Staging: Kubernetes cluster
- Production: Multi-region Kubernetes
- Database backups and disaster recovery
- Blue-green deployment strategy

## Future Considerations

### Phase 2 Features
- Mobile application
- Third-party integrations (Slack, Jira)
- Advanced analytics and ML insights
- Video conferencing integration
- Custom workflow automation

### Technical Debt Management
- Regular dependency updates
- Code refactoring schedule
- Performance optimization sprints
- Security audit schedule
- Documentation updates

This architecture provides a scalable, maintainable foundation for the project management application while allowing for future growth and feature additions.