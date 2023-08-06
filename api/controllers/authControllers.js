const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
require("dotenv").config();

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
const register = async (req, res) => {
  // console.log("on register");
  try {
    // Retrieve the bcrypt salt from .env file
    const bcryptSalt = Number(process.env.BCRYPT_SALT);

    const { fullName, username, password, role, phone, email, gender } =
      req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      logger.error("Username already exists");
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // Generate a salted hash of the password
    const hashedPassword = await bcrypt.hash(password, bcryptSalt);

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      role,
      phone,
      email,
      gender,
    });

    await newUser.save();

    logger.info("User registered successfully");
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    logger.error("Failed to register user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * @description User login
 * @route POST /api/auth/login
 * @access Public
 * @params {string} username - The user's username
 * @params {string} password - The user's password
 * @return {json} - Status and JSON { success:true, token:string, user:object }
 */
const login = async (req, res) => {
  try {
    // Retrieve the secret key from .env file
    const secretKey = process.env.JWT_SECRET;

    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });
    if (!user) {
      logger.error("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      logger.error("Invalid password");
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    logger.info("Login successful");
    return res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.log(error);
    logger.error("Failed to login user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * @description Get currently authenticated user
 * @route GET /api/auth/me
 * @access Private
 * @return {json} - Status and JSON { success:true, user:object }
 */
const getMe = async (req, res) => {
  try {
    // Retrieve the user ID from the authenticated request
    console.log("req.user", req.user);
    const userId = req.user.userId;

    // Fetch the user from the database using the user ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { password, ...rest } = user.toObject();

    // Return the user as a JSON response
    return res.status(200).json({
      success: true,
      user: rest,
    });
  } catch (error) {
    console.error("Failed to get user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { register, login, getMe };
