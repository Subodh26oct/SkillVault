import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { xss } from "express-xss-sanitizer";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import razorpayRoute from "./routes/razorpay.routes.js";
import healthRoute from "./routes/health.routes.js";
import aiRoute from "./routes/ai.route.js";
import adminRoute from "./routes/admin.route.js";
import logger from "./utils/logger.js";

// Load environment variables
dotenv.config();

// Connect to database
await connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// ─── 1. CORS — Manual raw handler, MUST be the very first middleware ─────────
const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean)
);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-Requested-With,Accept,Origin"
  );

  // Short-circuit OPTIONS preflight immediately — before any other middleware
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// ─── 2. Security Headers ─────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
  })
);

// ─── 3. Logging ──────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(
    morgan("dev", {
      stream: { write: (message) => logger.http(message.trim()) },
    })
  );
}

// ─── 4. Body Parsers ─────────────────────────────────────────────────────────
app.use(
  express.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── 5. Data Sanitization (after body parsers) ───────────────────────────────
app.use(xss());
app.use(hpp());

// ─── 6. Rate Limiting ────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// ─── 7. API Routes ───────────────────────────────────────────────────────────
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/v1/razorpay", razorpayRoute);
app.use("/api/v1/ai", aiRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/health", healthRoute);

// ─── 8. 404 Handler ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// ─── 9. Global Error Handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(
    JSON.stringify({
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get("user-agent"),
    })
  );
  return res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ─── 10. Start Server ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(
    `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`
  );
});
