const express = require("express");
const router = express.Router();
const { validateTask } = require("../middlewares/validateMiddleware");

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middlewares/authMiddleware");

router
  .route("/")
  .post(protect, validateTask, createTask)
  .get(protect, getAllTasks);

router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
