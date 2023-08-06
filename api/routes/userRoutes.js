const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

/**
 * @description Add a new user
 * @route POST /api/users
 * @access Private (only accessible by users with 'admin' role)
 */
router.post("/", userController.addUser);

/**
 * @description Get all users
 * @route GET /api/users
 * @access Private (admin)
 */
router.get("/", userController.getAllUsers);

/**
 * @description Get a single user by ID
 * @route GET /api/users/:id
 * @access Private (admin)
 */
router.get("/:id", userController.getUserById);

/**
 * @description Update a user
 * @route PUT /api/users/:id
 * @access Private (only accessible by users with 'admin' role)
 */
router.put("/:id", userController.updateUser);

/**
 * @description Delete a user
 * @route DELETE /api/users/:id
 * @access Private (only accessible by users with 'admin' role)
 */
router.delete("/:id", userController.deleteUser);

module.exports = router;
