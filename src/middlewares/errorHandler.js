const errorHandler = (err, req, res, next) => {
  console.log(`Error Intercepted: ${err.message}`);

  let statusCode = err.message || 500;
  let message = err.message || `Internal Server Error`;

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  if (err.name === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered (Resource already exists)";
  }

  if (err.name === `ValidateError`) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
