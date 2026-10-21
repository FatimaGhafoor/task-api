# AppRo8 Task Management API

Node.js/Express REST service for authenticated personal task records backed by MongoDB. The process boots from `src/server.js`, parses JSON bodies, mounts OpenAPI UI at `/api-docs`, and splits public credential issuance (`/api/auth`) from JWT-gated task CRUD (`/api/tasks`). Task creation is schema-checked with Zod before persistence. Access tokens are issued in JSON responses and consumed from the `Authorization: Bearer` header; this codebase does not set or read HTTP cookies.

## Request pipeline

The stack below is the live Express order in `src/server.js`, with the task-route middleware chain from `src/routes/taskRoutes.js`.

```
Client
  |
  v
dotenv.config()                    # process.env from .env
  |
  v
connectDB()                        # mongoose.connect(process.env.MONGO_URI)
  |
  v
express.json()                     # app.use(express.json())
  |
  +-- GET  /                       -> welcome JSON
  +-- GET  /api-docs               -> swagger-ui-express + swagger-jsdoc
  +-- POST /api/auth/register      -> registerUser (no protect)
  +-- POST /api/auth/login         -> loginUser (no protect)
  |
  +-- /api/tasks  (router)
  |      |
  |      +-- POST /                -> protect -> validateTask (Zod) -> createTask
  |      +-- GET  /                -> protect -> getAllTasks
  |      +-- PUT  /:id             -> protect -> updateTask
  |      +-- DELETE /:id           -> protect -> deleteTask
  |
  v
errorHandler                       # 4-arg Express handler (CastError, 11000, ValidationError)
  |
  v
process listeners                  # unhandledRejection / uncaughtException -> server.close()
```

`protect` (`src/middlewares/authMiddleware.js`) extracts `jwt.verify` of `Authorization` Bearer tokens using `JWT_SECRET`, loads `User` by `decoded.id` with `.select("-password")`, and attaches `req.user`. Missing or invalid tokens yield HTTP 401 via `errorHandler`.

## Technical features

- **Zod request gate on create:** `validateTask` in `src/middlewares/validateMiddleware.js` runs `taskValidationSchema.safeParse(req.body)` only on `POST /api/tasks`. `title` and `description` are required non-empty trimmed strings. `status` is optional and constrained to `pending | in-progress | completed`. Failures return `400` with `{ success: false, errors: string[] }`.
- **JWT issuance:** `generateToken` in `src/controllers/authController.js` signs `{ id }` with `jsonwebtoken` and `process.env.JWT_SECRET`, `expiresIn: "30d"`. `POST /api/auth/register` (201) and `POST /api/auth/login` (200) return `token` in the JSON body alongside `{ id, name, email }`.
- **JWT enforcement:** All `/api/tasks` handlers are preceded by `protect`. Tokens are not stored in cookies; clients must send `Authorization: Bearer <token>`.
- **Password hashing:** `User` pre-save hook in `src/models/User.js` salts with `bcryptjs` (`genSalt(10)`) when `password` is modified. Minimum length is 6. Login uses `user.matchPassword()`.
- **Per-user task scoping on read/create:** `createTask` sets `user: req.user._id`. `getAllTasks` queries `Task.find({ user: req.user._id })`.
- **Mongoose persistence:** `Task` documents include `user` ObjectId ref, `title`, optional `description`, `status` enum defaulting to `pending`, and `timestamps`. Duplicate emails surface as Mongo `11000` mapped to 400 by `errorHandler`.
- **OpenAPI:** `swagger-jsdoc` scans `./src/routes/*.js`; UI is served at `/api-docs` with BearerAuth defined as HTTP bearer JWT.
- **Operational shutdown:** `unhandledRejection` and `uncaughtException` log the error, close the HTTP server, and `process.exit(1)`.

## Local installation and setup

### Prerequisites

- Node.js capable of running Express 5 and Mongoose 9
- A MongoDB instance reachable by URI (local process or Atlas)

### Steps

1. Clone the repository and enter the project root.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root (the file is gitignored). Variable names match `src/config/db.js`, `src/controllers/authController.js`, `src/middlewares/authMiddleware.js`, `src/middlewares/errorHandler.js`, and `src/server.js`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/appro8_tasks
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
```

4. Start the HTTP listener:

```bash
npm run dev
```

This runs `nodemon src/server.js`. For a single process without reload, use `npm start` (`node src/server.js`). On success the console prints `MongoDB Connected: <host>` and `Server running in development mode on port <PORT>`. Default bind port is `5000` when `PORT` is unset.

5. Confirm the process:

```bash
curl http://localhost:5000/
```

Expected body: `{ "success": true, "message": "Welcome to AppRo8 Task Management API - Server is Live!" }`. Interactive schema: `http://localhost:5000/api-docs`.

`vercel.json` routes all paths to `src/server.js` via `@vercel/node` if deployed on Vercel; local development does not require that file.

## API endpoint map

Base URL (local): `http://localhost:5000`. Task routes require header `Authorization: Bearer <JWT>`. Zod validation applies only to `POST /api/tasks`. `PUT /api/tasks/:id` and `DELETE /api/tasks/:id` currently update/delete by Mongo `_id` without an additional `user` filter in the controller.

| Method | Path | Auth | Request JSON | Success response |
| --- | --- | --- | --- | --- |
| `GET` | `/` | None | None | `200` `{ "success": true, "message": "Welcome to AppRo8 Task Management API - Server is Live!" }` |
| `GET` | `/api-docs` | None | None | Swagger UI HTML |
| `POST` | `/api/auth/register` | None | `{ "name": "string", "email": "string", "password": "string" }` — all required; password min 6 via Mongoose | `201` `{ "success": true, "message": "User registered successfully", "token": "<jwt>", "user": { "id", "name", "email" } }` |
| `POST` | `/api/auth/login` | None | `{ "email": "string", "password": "string" }` | `200` `{ "success": true, "token": "<jwt>", "user": { "id", "name", "email" } }` |
| `POST` | `/api/tasks` | Bearer JWT | `{ "title": "string", "description": "string", "status": "pending" \| "in-progress" \| "completed" }` — `title` and `description` required by Zod; `status` optional (model default `pending`) | `201` `{ "success": true, "data": <Task> }` |
| `GET` | `/api/tasks` | Bearer JWT | None | `200` `{ "success": true, "count": <n>, "data": [<Task>] }` |
| `PUT` | `/api/tasks/:id` | Bearer JWT | Partial document fields passed through to `findByIdAndUpdate` (typically `title`, `description`, `status`). No Zod middleware on this route. | `200` `{ "success": true, "data": <Task> }` |
| `DELETE` | `/api/tasks/:id` | Bearer JWT | None | `200` `{ "success": true, "message": "Task deleted successfully" }` |

`:id` is the MongoDB `_id` string.

### Representative error bodies

| Condition | Status | Body shape |
| --- | --- | --- |
| Zod failure on create | `400` | `{ "success": false, "errors": ["Title is required", ...] }` |
| Missing register/login fields, duplicate email, Mongoose validation, CastError | `400` (via `errorHandler` or controller `next`) | `{ "success": false, "error": "<message>", "stack": <string\|null> }` |
| Invalid login credentials | `401` | `{ "success": false, "error": "Invalid email or password", "stack": ... }` |
| Missing or invalid JWT on `/api/tasks` | `401` | `{ "success": false, "error": "Not authorized, no token provided" \| "Not authorized, token failed or expired", "stack": ... }` |
| Unknown task `_id` on update/delete | `404` | `{ "success": false, "message": "Task not found" }` |

`stack` is omitted (`null`) when `NODE_ENV=production`.

### Task document fields (Mongoose)

| Field | Type | Notes |
| --- | --- | --- |
| `user` | ObjectId → `User` | Set from `req.user._id` on create |
| `title` | String | Required, trimmed |
| `description` | String | Trimmed; required by Zod on create, not required on the schema |
| `status` | String | `pending` (default), `in-progress`, `completed` |
| `createdAt` / `updatedAt` | Date | Schema `timestamps: true` |
