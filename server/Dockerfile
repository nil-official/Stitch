# ------------ Stage 1: Build the application using Maven ------------

# Use an official Maven image with JDK 17 to build the project
FROM maven:3.9.10-eclipse-temurin-21 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy all project files to the container
COPY . .

# Build the application and skip tests for faster build
RUN mvn clean package -DskipTests


# ------------ Stage 2: Run the built application ------------

# Use a lightweight JDK 17 image to run the application
FROM eclipse-temurin:21-jdk-alpine

# Label the image author
LABEL authors="Niladri Chakraborty"

# Set the working directory in the container
WORKDIR /app

# Copy only the built JAR from the first stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the app will run on
EXPOSE 8080

# Define the command to run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
