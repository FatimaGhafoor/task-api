# AppRo8 Task Management API

A RESTful Task Management API built with **Node.js, Express.js, MongoDB, and Mongoose**. The API supports user registration, login, JWT-based authentication, and personal task management through CRUD operations.

The project was developed as part of the **AppRo8 Full Stack Developer Internship** and demonstrates REST API design, password hashing, request validation, database integration, authorization, and interactive API documentation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture and Request Flow](#architecture-and-request-flow)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Request and Response Examples](#request-and-response-examples)
- [Validation and Error Handling](#validation-and-error-handling)
- [Task Data Model](#task-data-model)
- [Security Considerations](#security-considerations)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [Author](#author)

## Features

- **User registration and login** with email and password.
- **Password hashing** using `bcryptjs` before storing passwords.
- **JWT authentication** with token expiration.
- **Task CRUD operations** — create, read, update, and delete tasks.
- **User-specific task access** — users can manage only their own tasks.
- **Request validation** using Zod when creating tasks.
- **MongoDB persistence** through Mongoose models.
- **Centralized error handling** for common API and database errors.
- **Interactive API documentation** using Swagger UI and OpenAPI.
- **Environment-based configuration** for secrets, database connections, and application settings.

## Tech Stack

| Technology                      | Purpose                                     |
| ------------------------------- | ------------------------------------------- |
| Node.js                         | JavaScript runtime                          |
| Express.js                      | HTTP server and REST API routing            |
| MongoDB                         | NoSQL database                              |
| Mongoose                        | Database schemas, models, and queries       |
| JSON Web Token (`jsonwebtoken`) | Authentication and token verification       |
| `bcryptjs`                      | Password hashing and comparison             |
| Zod                             | Request body validation for task creation   |
| Swagger UI Express              | Interactive API documentation               |
| Swagger JSDoc                   | OpenAPI specification generation            |
| dotenv                          | Environment variable configuration          |
| Nodemon                         | Automatic server restart during development |

## Architecture and Request Flow

The application separates authentication, routing, middleware, controllers, and database models to improve maintainability and keep responsibilities organized.

```text
Client (Postman / Frontend)
          |
          v
   Express Application
          |
          v
    JSON Body Parser
          |
          +-----------------------+
          |                       |
          v                       v
    /api/auth                  /api/tasks
          |                       |
          v                       v
  Authentication Logic      JWT Protection
          |                       |
          v                       v
     User Model            Route-specific Middleware
                                  |
                                  v
                              Controllers
                                  |
                                  v
                            Mongoose Models
                                  |
                                  v
                               MongoDB

       Centralized Error Handler
                  |
                  v
          HTTP Error Response
```

### Authentication flow

1. A user registers or logs in using their credentials.
2. The API verifies the credentials and generates a signed JWT.
3. The client receives the token in the JSON response.
4. The client sends the token in the `Authorization` header when accessing protected endpoints.
5. Authentication middleware verifies the token and loads the associated user.
6. Task controllers use the authenticated user's ID to restrict access to that user's tasks.

## Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/) — use a version compatible with the project's installed dependencies.
- npm — included with Node.js.
- [MongoDB](https://www.mongodb.com/) — a local instance or MongoDB Atlas account.
- [Git](https://git-scm.com/) — for cloning the repository.
- [Postman](https://www.postman.com/) or another HTTP client for testing.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/FatimaGhafoor/task-api.git
```

### 2. Navigate to the project directory

```bash
cd task-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root and add the configuration described in the next section.

### 5. Start the application

```bash
npm run dev
```

The development server should connect to MongoDB and start listening on the configured port.

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/appro8_tasks
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
```

| Variable     | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| `PORT`       | Port on which the Express server listens. Defaults to `5000` if unset. |
| `MONGO_URI`  | MongoDB connection string for a local database or Atlas cluster.       |
| `JWT_SECRET` | Secret used to sign and verify JWTs.                                   |
| `NODE_ENV`   | Application environment, such as `development` or `production`.        |

**Important:**

- Replace the example `JWT_SECRET` with a strong, randomly generated secret.
- Use your actual MongoDB connection string when using Atlas.
- Never commit `.env` or expose database credentials and JWT secrets in public repositories.
- Ensure `.env` is included in `.gitignore`.

## Running the Application

### Development mode

```bash
npm run dev
```

This runs the application with Nodemon when configured in `package.json`.

### Production-style local start

```bash
npm start
```

This runs the application using Node.js without Nodemon, provided the `start` script is configured as `node src/server.js`.

### Verify the server

Open the following URL in your browser or HTTP client:

`http://localhost:5000/`

Expected response:

```json
{
  "success": true,
  "message": "Welcome to AppRo8 Task Management API - Server is Live!"
}
```

The exact response depends on the running version of the application.

## API Documentation

Interactive API documentation is available through Swagger UI:

**Local URL:** `http://localhost:5000/api-docs`

Swagger UI allows you to explore documented endpoints, review request and response schemas, and send API requests.

For protected endpoints:

1. Register a user or log in.
2. Copy the returned JWT.
3. Click **Authorize** in Swagger UI.
4. Enter the token using the Bearer authentication scheme.
5. Execute a protected request.

The API uses an OpenAPI specification generated through `swagger-jsdoc`.

## API Endpoints

**Base URL:** `http://localhost:5000`

All task endpoints require a valid JWT. Registration and login are public.

### General

| Method | Endpoint    | Authentication | Description         |
| ------ | ----------- | -------------- | ------------------- |
| GET    | `/`         | Not required   | Check server status |
| GET    | `/api-docs` | Not required   | Open Swagger UI     |

### Authentication

| Method | Endpoint             | Authentication | Success status | Description                   |
| ------ | -------------------- | -------------- | -------------- | ----------------------------- |
| POST   | `/api/auth/register` | Not required   | `201 Created`  | Register a new user           |
| POST   | `/api/auth/login`    | Not required   | `200 OK`       | Authenticate an existing user |

### Tasks

| Method | Endpoint         | Authentication | Success status | Description                             |
| ------ | ---------------- | -------------- | -------------- | --------------------------------------- |
| POST   | `/api/tasks`     | Bearer JWT     | `201 Created`  | Create a task                           |
| GET    | `/api/tasks`     | Bearer JWT     | `200 OK`       | Retrieve the authenticated user's tasks |
| PUT    | `/api/tasks/:id` | Bearer JWT     | `200 OK`       | Update an owned task                    |
| DELETE | `/api/tasks/:id` | Bearer JWT     | `200 OK`       | Delete an owned task                    |

`:id` is the MongoDB ObjectId of the task.

## Authentication

The API uses JSON Web Tokens for stateless authentication.

### Register a user

**POST** `/api/auth/register`

Request body:

```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "Test123456"
}
```

Successful response — `201 Created`:

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<jwt>",
  "user": {
    "id": "<user_id>",
    "name": "Test User",
    "email": "testuser@example.com"
  }
}
```

The token and IDs above are placeholders.

### Log in

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "testuser@example.com",
  "password": "Test123456"
}
```

Successful response — `200 OK`:

```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "id": "<user_id>",
    "name": "Test User",
    "email": "testuser@example.com"
  }
}
```

### Send the token

For protected requests, include this header:

```http
Authorization: Bearer <jwt>
```

The token is signed using `JWT_SECRET` and configured to expire after 30 days. The client must send the token with each protected request. The API does not use HTTP cookies for authentication.

## Request and Response Examples

The following examples use the local base URL. Replace placeholder IDs and tokens with values returned by your API.

### 1. Create a task

**POST** `/api/tasks`

Headers:

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

Request body:

```json
{
  "title": "Complete API Documentation",
  "description": "Document and test the task management endpoints",
  "status": "pending"
}
```

Successful response — `201 Created`:

```json
{
  "success": true,
  "data": {
    "_id": "<task_id>",
    "user": "<user_id>",
    "title": "Complete API Documentation",
    "description": "Document and test the task management endpoints",
    "status": "pending",
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>"
  }
}
```

The API assigns the task to the authenticated user. The example omits other possible Mongoose fields.

### 2. Retrieve tasks

**GET** `/api/tasks`

Headers:

```http
Authorization: Bearer <jwt>
```

Successful response — `200 OK`:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "<task_id>",
      "user": "<user_id>",
      "title": "Complete API Documentation",
      "description": "Document and test the task management endpoints",
      "status": "pending",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    }
  ]
}
```

The `count` represents the number of tasks belonging to the authenticated user.

### 3. Update a task

**PUT** `/api/tasks/:id`

Example endpoint:

`PUT /api/tasks/<task_id>`

Request body:

```json
{
  "title": "Updated API Documentation",
  "status": "completed"
}
```

Successful response — `200 OK`:

```json
{
  "success": true,
  "data": {
    "_id": "<task_id>",
    "user": "<user_id>",
    "title": "Updated API Documentation",
    "description": "Document and test the task management endpoints",
    "status": "completed",
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>"
  }
}
```

The update controller accepts partial task fields. It applies Mongoose update validators, but this route does not currently use the Zod validation middleware.

### 4. Delete a task

**DELETE** `/api/tasks/:id`

Headers:

```http
Authorization: Bearer <jwt>
```

Successful response — `200 OK`:

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### 5. Test an empty task list

**GET** `/api/tasks`

If the authenticated user has no tasks, the response is:

```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

## Validation and Error Handling

The application uses Zod for task creation validation and centralized error handling for application and database errors.

### Task creation validation

The Zod middleware runs on `POST /api/tasks`.

| Field         | Requirement                                                            |
| ------------- | ---------------------------------------------------------------------- |
| `title`       | Required, non-empty trimmed string                                     |
| `description` | Required, non-empty trimmed string                                     |
| `status`      | Optional; allowed values are `pending`, `in-progress`, and `completed` |

If validation fails, the API returns `400 Bad Request` with a response shaped like:

```json
{
  "success": false,
  "errors": ["Title is required"]
}
```

The exact validation messages depend on the submitted data and schema.

### Common error responses

| Scenario                                     | Expected status    | Description                                                                      |
| -------------------------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| Missing required registration fields         | `400 Bad Request`  | Required user details were not supplied                                          |
| Duplicate email                              | `400 Bad Request`  | An account already exists with that email                                        |
| Invalid login credentials                    | `401 Unauthorized` | Email or password is incorrect                                                   |
| Missing or invalid JWT                       | `401 Unauthorized` | Authentication is required or the token is invalid/expired                       |
| Invalid task creation body                   | `400 Bad Request`  | Zod validation failed                                                            |
| Task not found or not owned by the requester | `404 Not Found`    | The task is unavailable to that user                                             |
| Mongoose validation or malformed ObjectId    | `400 Bad Request`  | Database validation or casting failed, according to the configured error handler |

Error response bodies depend on the relevant controller, middleware, and environment configuration. In production, internal stack traces should not be exposed to clients.

## Task Data Model

Task documents are stored in MongoDB through the Mongoose `Task` model.

| Field         | Type               | Description                                   |
| ------------- | ------------------ | --------------------------------------------- |
| `_id`         | ObjectId           | Unique task identifier                        |
| `user`        | ObjectId reference | ID of the user who owns the task              |
| `title`       | String             | Required task title                           |
| `description` | String             | Task description; required by Zod on creation |
| `status`      | String             | `pending`, `in-progress`, or `completed`      |
| `createdAt`   | Date               | Creation timestamp                            |
| `updatedAt`   | Date               | Last update timestamp                         |

Mongoose timestamps automatically maintain `createdAt` and `updatedAt`.

The default task status is `pending`.

## Security Considerations

- Passwords are hashed using `bcryptjs`; plaintext passwords should never be stored.
- JWTs are signed using a secret configured through environment variables.
- Protected endpoints require a valid Bearer token.
- Task creation assigns ownership using the authenticated user's ID.
- Task retrieval filters records by the authenticated user's ID.
- Task updates and deletions filter by both task ID and authenticated user ID, preventing users from modifying or deleting another user's tasks.
- Secrets and credentials should not be committed to source control.
- Production deployments should use HTTPS and avoid exposing internal error details.

## Testing

The endpoints can be tested with Postman, Swagger UI, or another HTTP client.

Recommended test sequence:

1. Register a new user.
2. Confirm registration returns `201 Created`.
3. Log in and obtain a JWT.
4. Call `GET /api/tasks` with the token.
5. Create a task with valid data.
6. Retrieve the task and verify its fields.
7. Update the task and verify the changes.
8. Delete the task and confirm it no longer appears.
9. Call a protected endpoint without a token and confirm it returns `401 Unauthorized`.
10. Test invalid task input and confirm validation errors are returned.
11. Attempt to update or delete another user's task and confirm access is denied.

A successful CRUD test should confirm both the HTTP response and the resulting database state.

## Project Structure

The main source files are organized by responsibility:

```text
task-api/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   └── server.js
├── .env                  # Local secrets; do not commit
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── vercel.json           # Deployment configuration, if used
```

This tree represents the primary application files; other configuration or project files may also exist in the repository.

## Future Improvements

Potential improvements include:

- Add Zod validation to task update requests.
- Add automated tests for authentication, validation, CRUD, and ownership checks.
- Improve input normalization and email validation.
- Add pagination and filtering for task lists.
- Add rate limiting and stronger production security configuration.
- Add a continuous integration workflow to run tests automatically.

## Author

**Fatima Ghafoor**

## Live Demo

- **Live API:** https://task-api-ecru.vercel.app/
- **Swagger API Documentation:** https://task-api-ecru.vercel.app/api-docs/

## Project Repository

[AppRo8 Task Management API](https://github.com/FatimaGhafoor/task-api)

[FatimaGhafoor](https://github.com/FatimaGhafoor)

Developed as part of the AppRo8 Full Stack Developer Internship.
