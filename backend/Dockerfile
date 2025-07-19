# Development Dockerfile for Backend
FROM openjdk:21-jdk-slim

# Install Maven
RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Maven files for dependency caching
COPY pom.xml ./
COPY .mvn .mvn
COPY mvnw ./

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Expose port
EXPOSE 20003

# Run Spring Boot with hot reload
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=*:5005"]