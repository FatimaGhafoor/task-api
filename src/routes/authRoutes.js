const express = require("express");
const router = express.router();
const { registerUser } = require("../controllers/authController");

router.post("/register", registerUser);
module.exports = router;
