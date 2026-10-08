const { z } = require("zod");

const taskValidationSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title cannot be empty." }),
  description: z
    .string({ required_error: "Description is required" })
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
  try {
    taskValidationSchema.parse(req.body);
    next();
  } catch (error) {
    const errorMessage = error.errors.map((err) => err.message);

    return res.status(400).json({
      success: false,
      errors: errorMessage,
    });
  }
};

module.exports = { validateTask };
