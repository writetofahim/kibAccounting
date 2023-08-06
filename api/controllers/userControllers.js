const User = require("../models/User");
const logger = require("../config/logger");
const bcrypt = require("bcrypt");
require("dotenv").config();

// @desc    Add a new user
// @route   POST /api/users
// @access  Private (only accessible by users with 'admin' role)
const addUser = async (req, res) => {
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

    logger.info("User added successfully", newUser);
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    logger.error("Failed to add user", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @description Create a new user
 * @route POST /api/users
 * @access Private (admin)
 */
const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    logger.info("New user created", {
      userId: newUser._id,
      fullName: newUser.fullName,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    logger.error("Failed to create user", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

/**
 * @description Get all users
 * @route GET /api/users
 * @access Private (admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    logger.info("Retrieved all users", {
      count: users.length,
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    logger.error("Failed to get users", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to get users",
    });
  }
};

/**
 * @description Get a single user by ID
 * @route GET /api/users/:id
 * @access Private (admin)
 */
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info("Retrieved user by ID", {
      userId: user._id,
      fullName: user.fullName,
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error("Failed to get user by ID", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private (only accessible by users with 'admin' role)
const updateUser = async (req, res) => {
  try {
    // Retrieve the bcrypt salt from .env file
    const bcryptSalt = Number(process.env.BCRYPT_SALT);

    const { id } = req.params;
    const { fullName, username, password, role, phone, email, gender } =
      req.body;

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, bcryptSalt);

    const user = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        username,
        password: hashedPassword,
        role,
        phone,
        email,
        gender,
      },
      { new: true }
    );

    if (!user) {
      logger.error("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info("User updated successfully", user);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error("Failed to update user", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (only accessible by users with 'admin' role)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      logger.error("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    logger.info("User deleted successfully");
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error("Failed to delete user", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  addUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
