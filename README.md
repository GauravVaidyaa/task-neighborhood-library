# Neighborhood Library
A Neighborhood Library Management System that manages members, books, and lending operations using a modern backend architecture with gRPC, Node.js API Gateway, PostgreSQL, and a React UI.


---

## Quick Start (Using Docker)

### Prerequisites
- Docker Desktop installed
- Git

### Steps to Run the application

- Clone the repository
  ```bash
    git clone <repository-url>
    cd neighborhood-library

  ```
- Create a .env file in the root directory
- Copy the contents from .env.example into .env
- Update values as below:
    ```bash
    POSTGRES_DB=neighborhood_library
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    DB_HOST=postgres
    DB_PORT=5432
    ```
- Create .env file for frontend and for that Navigate to:
  ```bash
    client/library-ui
  ```
- Create a .env file
- Copy contents from .env.example into .env
- Then run below command
    ```bash
    docker-compose up -d --build
    ```
    This command will:
    - Start PostgreSQL
    - Initialize database schema
    - Start Python gRPC server
    - Start Node.js API Gateway
    - Start React frontend



### Access URLs
---

| Service   | URL     | 
| :-------- | :-------|
| `Frontend (UI)` | [`http://localhost:5173`](http://localhost:5173)|
| `API Gateway (Node)` | [`http://localhost:5000`](http://localhost:5000)|
| `PostgreSQL`| [`localhost:5432`](localhost:5432)|
                             

### Notes
---
- No manual database setup is required; schema is initialized automatically.
- All services are containerized and run together via Docker Compose.
- The API Gateway translates HTTP requests to gRPC calls and handles error mapping and logging.