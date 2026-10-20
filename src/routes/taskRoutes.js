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
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success return of personalized user tasks array
 *       401:
 *         description: Not authorized, token missing or invalid
 *   post:
 *     summary: Create a new personalized task
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn Swagger Documentation
 *               description:
 *                 type: string
 *                 example: Build production-grade OpenAPI specifications layout.
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 example: pending
 *     responses:
 *       201:
 *         description: Task successfully created and interlinked to user account
 *       400:
 *         description: Input schema validation failed via Zod gatekeeper
 *       401:
 *         description: Not authorized
 */
router
  .route("/")
  .post(protect, validateTask, createTask)
  .get(protect, getAllTasks);

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     summary: Update an existing task content or status
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique MongoDB identification string (_id)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       200:
 *         description: Task successfully modified and states synchronized
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Target task parameter not found inside database context
 *   delete:
 *     summary: Delete a specific task permanently
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique MongoDB identification string (_id)
 *     responses:
 *       200:
 *         description: Target documentation task deleted successfully from cluster
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Resource tracking parameter not found
 */
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
