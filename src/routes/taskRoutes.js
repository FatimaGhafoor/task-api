const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.route("/").post(createTask).get(getAllTasks);
router.route("/:id").put(updateTask).delete(deleteTask);

module.exports = router;
