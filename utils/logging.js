import logger from "./logger.js";

// Request logging middleware
export const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

// API response logging
export const responseLogger = (req, res, next) => {
  const start = Date.now();

  // Override res.json to log responses
  const originalJson = res.json.bind(res);
  res.json = function (data) {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.path} - Status: ${res.statusCode} - ${duration}ms`,
    );
    return originalJson(data);
  };

  next();
};

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode || 500,
  });
  next(err);
};

// Payment logging
export const logPayment = (paymentData) => {
  logger.info(`Payment processed: ${JSON.stringify(paymentData)}`);
};

// Auth logging
export const logAuth = (action, userId, details) => {
  logger.info(`Auth ${action} - User: ${userId} - ${JSON.stringify(details)}`);
};

// Course logging
export const logCourseAction = (action, userId, courseId, details) => {
  logger.info(
    `Course ${action} - User: ${userId} - Course: ${courseId} - ${JSON.stringify(details)}`,
  );
};

export default {
  requestLogger,
  responseLogger,
  errorLogger,
  logPayment,
  logAuth,
  logCourseAction,
};
