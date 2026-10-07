require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to AppRo8 Task Management API - Server is Live!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in development mode on port ${PORT}`);
});
