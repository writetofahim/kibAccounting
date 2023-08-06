/**
 * @description Authentication routes
 * @routes /api/auth
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

/**
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @params {string} fullName - The user's full name
 * @params {string} username - The user's username
 * @params {string} password - The user's password
 * @params {string} role - The user's role
 * @params {string} [phone] - The user's phone number (optional)
 * @params {string} [email] - The user's email (optional)
 * @params {string} [gender] - The user's gender (optional)
 * @return {json} - Status and JSON { success:true, message:string }
 */
router.post("/register", authController.register);

/**
 * @description User login
 * @route POST /api/auth/login
 * @access Public
 * @params {string} username - The user's username
 * @params {string} password - The user's password
 * @return {json} - Status and JSON { success:true, token:string, user:object }
 */
router.post("/login", authController.login);

/**
 * @description Get currently authenticated user
 * @route GET /api/auth/me
 * @access Private
 * @return {json} - Status and JSON { success:true, user:object }
 */
router.get("/me", authController.getMe);

module.exports = router;
