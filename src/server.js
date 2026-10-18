require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

connectDB();

app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to AppRo8 Task Management API - Server is Live!",
  });
});

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.log("Shutting down server gracefully...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.log("Shutting down server gracefully...");
  server.close(() => {
    process.exit(1);
  });
});
