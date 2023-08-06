const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountControllers");

/**
 * @description Create a new account
 * @route POST /api/accounts
 * @access Private
 */
router.post("/", accountController.createAccount);

/**
 * @description Get all accounts
 * @route GET /api/accounts
 * @access Private
 */
router.get("/", accountController.getAllAccounts);

/**
 * @description Get account by ID
 * @route GET /api/accounts/:id
 * @access Private
 * @param {string} id - The account ID
 */
router.get("/:id", accountController.getAccountById);

/**
 * @description Update account
 * @route PUT /api/accounts/:id
 * @access Private
 * @param {string} id - The account ID
 */
router.put("/:id", accountController.updateAccount);

/**
 * @description Delete account
 * @route DELETE /api/accounts/:id
 * @access Private
 * @param {string} id - The account ID
 */
router.delete("/:id", accountController.deleteAccount);

module.exports = router;
