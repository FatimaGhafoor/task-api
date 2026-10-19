const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.statusCode = 400;
      return next(new Error("All fields are required"));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.statusCode = 400;
      return next(new Error("User already exists"));
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.statusCode = 400;
      return next(new Error("Please provide email and password"));
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email },
      });
    } else {
      res.statusCode = 401;
      return next(new Error("Invalid email or password"));
    }
  } catch (error) {
    next(error);
  }
};
