const express = require("express");
const router = express.Router();
const accountCategoryController = require("../controllers/accountCategoryControllers");

/**
 * @description Create a new account category
 * @route POST /api/account-categories
 * @access Private
 */
router.post("/", accountCategoryController.createAccountCategory);

/**
 * @description Get all account categories
 * @route GET /api/account-categories
 * @access Public
 */
router.get("/", accountCategoryController.getAllAccountCategories);

/**
 * @description Update an account category
 * @route PUT /api/account-categories/:id
 * @access Private
 */
router.put("/:id", accountCategoryController.updateAccountCategory);

/**
 * @description Delete an account category
 * @route DELETE /api/account-categories/:id
 * @access Private
 */
router.delete("/:id", accountCategoryController.deleteAccountCategory);

module.exports = router;
