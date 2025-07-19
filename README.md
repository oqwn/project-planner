# Project Planner

A full-stack project planning application built with React (Vite) frontend and Spring Boot backend.

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- pnpm for package management
- ESLint + Prettier for code quality
- Port: 5173

### Backend
- Spring Boot 3.4.5
- Java 21
- Maven for build management
- PostgreSQL database
- Port: 20005

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- Java 21+
- Docker and Docker Compose (for containerized development)

### Local Development

#### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Docker Development

Using Docker Compose for the full stack:

```bash
# Start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or run in detached mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## Available Scripts

### Frontend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Backend
- `./mvnw spring-boot:run` - Run the application
- `./mvnw test` - Run tests
- `./mvnw clean package` - Build JAR file

## Project Structure

```
project-planner/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Spring Boot backend application
│   ├── src/           # Java source code
│   └── pom.xml        # Backend dependencies
├── docker-compose.yml # Docker configuration
└── .github/           # CI/CD workflows
```

## CI/CD

GitHub Actions workflows are configured for:
- Continuous Integration (testing, linting, building)
- Dependency update checks
- Docker image builds

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is licensed under the MIT License.