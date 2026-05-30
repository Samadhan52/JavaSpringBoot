# Smart Clinic Management System

Smart Clinic Management System is a Spring Boot web application for managing clinic users, doctors, patients, appointments, and prescriptions. The application serves static and Thymeleaf pages from the same backend and exposes REST endpoints for the frontend JavaScript modules.

## Tech Stack

- Java 17
- Spring Boot 3.4.4
- Maven
- Spring Web
- Spring Data JPA with MySQL
- Spring Data MongoDB for prescriptions
- Thymeleaf
- JWT-based token support
- Docker

## Project Structure

```text
.
├── README.md
└── app/
    ├── pom.xml
    ├── mvnw / mvnw.cmd
    ├── Dockerfile
    └── src/
        ├── main/java/com/project/back_end/   # Spring Boot source code
        ├── main/resources/application.properties
        ├── main/resources/static/            # Static HTML, CSS, JS, images
        └── main/resources/templates/         # Thymeleaf templates
```

## Prerequisites

Install the following before running the application locally:

1. **JDK 17**
   - Verify with:
     ```bash
     java -version
     ```
2. **Maven 3.9+**
   - Verify with:
     ```bash
     mvn -version
     ```
3. **MySQL** database server.
4. **MongoDB** database server.
5. **Docker** is optional if you want to build and run the container image.

## Database Setup

The application uses both MySQL and MongoDB:

- MySQL stores relational data such as admins, doctors, patients, and appointments.
- MongoDB stores prescription documents.

### MySQL

Create the application database before starting the app:

```sql
CREATE DATABASE cms;
```

Spring Boot is configured with `spring.jpa.hibernate.ddl-auto=update`, so JPA-managed tables are created or updated automatically when the app starts.

### MongoDB

Create or make available a MongoDB database named `prescriptions`. If authentication is enabled, create a user with read/write access and use that user in the MongoDB connection string.

## Configuration

Runtime configuration is stored in:

```text
app/src/main/resources/application.properties
```

Before running locally, update the following values to match your environment:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cms?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.data.mongodb.uri=mongodb://YOUR_MONGO_USERNAME:YOUR_MONGO_PASSWORD@localhost:27017/prescriptions?authSource=admin

jwt.secret=CHANGE_THIS_TO_A_LONG_RANDOM_SECRET
```

For a MongoDB instance without authentication, use a URI such as:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/prescriptions
```

> Do not commit production passwords or secrets. Prefer environment-specific configuration or deployment secrets for real deployments.

## Run Locally

From the repository root, move into the Spring Boot application directory:

```bash
cd app
```

Start the application with Maven:

```bash
mvn spring-boot:run
```

When the app starts successfully, open:

```text
http://localhost:8080/
```

## Build

Build the application JAR from the `app` directory:

```bash
mvn clean package
```

The generated JAR is written to:

```text
app/target/back-end-0.0.1-SNAPSHOT.jar
```

To build without running tests:

```bash
mvn clean package -DskipTests
```

## Run Tests

From the `app` directory, run:

```bash
mvn test
```

The default Spring Boot context test requires the configured MySQL and MongoDB services to be reachable unless you override the database properties for testing.

## Docker

Build the Docker image from the `app` directory:

```bash
docker build -t smart-clinic-management-system .
```

Run the container:

```bash
docker run --rm -p 8080:8080 smart-clinic-management-system
```

If your databases are running outside the container, pass database settings with environment variables or mount an environment-specific configuration file. For example:

```bash
docker run --rm -p 8080:8080 \
  -e SPRING_DATASOURCE_URL='jdbc:mysql://host.docker.internal:3306/cms?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC' \
  -e SPRING_DATASOURCE_USERNAME='YOUR_MYSQL_USERNAME' \
  -e SPRING_DATASOURCE_PASSWORD='YOUR_MYSQL_PASSWORD' \
  -e SPRING_DATA_MONGODB_URI='mongodb://host.docker.internal:27017/prescriptions' \
  -e JWT_SECRET='CHANGE_THIS_TO_A_LONG_RANDOM_SECRET' \
  smart-clinic-management-system
```

On Linux, `host.docker.internal` may require extra Docker network configuration. Alternatively, run the databases and app on the same Docker network and use the database container names as hosts.

## Common Application URLs

After startup, commonly used pages include:

- Home page: `http://localhost:8080/`
- Admin dashboard: `http://localhost:8080/adminDashboard/{token}`
- Doctor dashboard: `http://localhost:8080/doctorDashboard/{token}`
- Static patient pages under: `http://localhost:8080/pages/`

## Troubleshooting

- **Database connection errors**: confirm MySQL and MongoDB are running and that `application.properties` points to the correct host, port, database, username, and password.
- **Port already in use**: stop the process using port `8080` or run with another port, for example `mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081`.
- **Docker cannot reach local databases**: use `host.docker.internal` where supported, or place the app and databases on a shared Docker network.
