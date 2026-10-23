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

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Get all tasks belonging to the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       401:
 *         description: Authentication token is missing, invalid, or expired
 *
 *   post:
 *     summary: Create a task for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn Swagger Documentation
 *               description:
 *                 type: string
 *                 example: Build an OpenAPI specification for the Task API.
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 default: pending
 *                 example: pending
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Request validation failed
 *       401:
 *         description: Authentication token is missing, invalid, or expired
 */
router
  .route("/")
  .post(protect, validateTask, createTask)
  .get(protect, getAllTasks);

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task belonging to the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated task title
 *               description:
 *                 type: string
 *                 example: Updated task description
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 example: in-progress
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid task ID or request data, if handled as a bad request
 *       401:
 *         description: Authentication token is missing, invalid, or expired
 *       404:
 *         description: Task not found or not accessible to the authenticated user
 *
 *   delete:
 *     summary: Delete a task belonging to the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Authentication token is missing, invalid, or expired
 *       404:
 *         description: Task not found or not accessible to the authenticated user
 */
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
