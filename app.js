require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// Extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// Connect DB
const connectDB = require("./db/connect");

// Protection
const authenticateUser = require("./middleware/authentication");

// Routers
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// ----------------
// Extra Packages
// ----------------
// Needed for if your using a proxy for rate limiter
app.set("trust proxy", 1)
// Limits the amount of requests to stop overloading
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100, // Limit each ip to 100 requests per windows
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
// authenticateUser protects the server from Users changing things
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // Connects your MONGO to the browser
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
