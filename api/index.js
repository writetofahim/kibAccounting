const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("./config/logger");

const {
  csrfProtection,
  authenticationMiddleware,
} = require("./middlewares/authentication");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add the requestLogger middleware to log information for all requests
app.use(require("./config/requestLogger"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("Failed to connect to MongoDB:", err));

// CSRF protection
// app.use(csrfProtection);

// Enable cookie parsing
app.use(cookieParser());

// Set up CSRF protection middleware
// app.use(function (req, res, next) {
//   // Exclude CSRF protection for login and register routes
//   if (req.path === "/api/auth/login" || req.path === "/api/auth/register") {
//     return next();
//   }

//   csurf({ cookie: true })(req, res, next);
// });

// JWT authentication
app.use(authenticationMiddleware);

// Routes
// Authentication routes
app.use("/api/auth", require("./routes/authRoutes"));
// User routes
app.use("/api/user", require("./routes/userRoutes"));
// Account Type routes
app.use("/api/account-types", require("./routes/accountTypeRoutes"));
// Account Sub-Type routes
app.use("/api/account-sub-types", require("./routes/accountSubTypeRoutes"));
// Account Category routes
app.use("/api/account-categories", require("./routes/accountCategoryRoutes"));
// Account routes
app.use("/api/accounts", require("./routes/accountRoutes"));
// Transaction routes
app.use("/api/transactions", require("./routes/transactionRoutes"));
// Transaction routes
app.use("/api/ledgers", require("./routes/ledgerRoutes"));
// Transaction routes
app.use("/api/reports", require("./routes/reportRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  logger.error(err);
  res.sendStatus(500);
});

// Start the server
const port = 8800; // Update the port to 8800
app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
