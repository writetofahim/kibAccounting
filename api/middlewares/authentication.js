// middlewares/authentication.js
const csurf = require("csurf");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (req.path === "/api/auth/login") return next();

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        logger.error("JWT verification failed:", err);
        res.sendStatus(401);
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = {
  csrfProtection: csurf({ cookie: true }),
  authenticationMiddleware,
};
