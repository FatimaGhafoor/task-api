const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      const authError = new Error("Not authorized, token failed or expired");
      res.statusCode = 401;
      return next(authError);
    }
  }

  if (!token) {
    const noTokenError = new Error("Not authorized, no token provided");
    res.statusCode = 401;
    return next(noTokenError);
  }
};

module.exports = { protect };
