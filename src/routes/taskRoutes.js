const express = require("express");
const router = express.Router();
const { validateTask } = require("../middlewares/validateMiddleware");

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.route("/").post(validateTask, createTask).get(getAllTasks);
router.route("/:id").put(updateTask).delete(deleteTask);

module.exports = router;
