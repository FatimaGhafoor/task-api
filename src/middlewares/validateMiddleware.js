const { z } = require("zod");

const taskValidationSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .trim()
    .min(1, { message: "Title cannot be empty." }),

  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .trim()
    .min(1, { message: "Description cannot be empty" }),

  status: z
    .enum(["pending", "in-progress", "completed"], {
      error_map: () => ({
        message: "Status must be pending, in-progress, or completed",
      }),
    })
    .optional(),
});

const validateTask = (req, res, next) => {
  const result = taskValidationSchema.safeParse(req.body);

  if (result.success) {
    return next();
  }

  const errorMessages = result.error.issues.map((issue) => {
    if (issue.code === "invalid_type" && issue.received === "undefined") {
      if (issue.path.includes("title")) return "Title is required";
      if (issue.path.includes("description")) return "Description is required";
    }
    return issue.message;
  });

  return res.status(400).json({
    success: false,
    errors: errorMessages,
  });
};

module.exports = { validateTask };
