const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: AppRo8 Tester
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testuser@appro8.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully; returns a JWT and user information
 *       400:
 *         description: Required fields are missing, input is invalid, or the email already exists
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user and obtain a JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testuser@appro8.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Authentication successful; returns a JWT and user information
 *       400:
 *         description: Required credentials are missing, if handled as a bad request
 *       401:
 *         description: Email or password is incorrect
 */

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
