const errorHandler = (err, req, res, next) => {
  console.log(`Error Intercepted: ${err.message}`);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered (Resource already exists)";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  if (
    typeof statusCode !== "number" ||
    isNaN(statusCode) ||
    statusCode < 100 ||
    statusCode > 599
  ) {
    statusCode = 500;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
