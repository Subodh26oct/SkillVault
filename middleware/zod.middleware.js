import { AppError } from "./error.middleware.js";

export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    return next(new AppError(`Validation failed: ${message}`, 400));
  }

  req.validated = result.data;
  return next();
};
