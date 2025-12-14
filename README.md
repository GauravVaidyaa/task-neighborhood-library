# Neighborhood Library
A small neighborhood library which have a new service to manage its members, books, and lending operations.


---

## Quick Start (Using Docker)

### Prerequisites
- Docker Desktop installed
- Git

### Steps to Run the application


- pull the code in you local machine.
- once pull, go into the project folder
- create .env file and copy the content from .env.example 
  file paste it into .env file.
- once paste, then replace the value as per below:
    ```bash
    POSTGRES_DB=neighborhood_library
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    DB_HOST=postgres
    DB_PORT=5432
    ```

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
                             




