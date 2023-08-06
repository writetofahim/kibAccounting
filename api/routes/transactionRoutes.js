const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionControllers");

/**
 * @description Create a new transaction
 * @route POST /api/transactions
 * @access Private
 */
router.post("/", transactionController.createTransaction);

/**
 * @description Get all transactions
 * @route GET /api/transactions
 * @access Private
 */
router.get("/", transactionController.getAllTransactions);

/**
 * @description Get transaction by ID
 * @route GET /api/transactions/:id
 * @access Private
 */
router.get("/:id", transactionController.getTransactionById);

/**
 * @description Update transaction
 * @route PUT /api/transactions/:id
 * @access Private
 */
router.put("/:id", transactionController.updateTransaction);

/**
 * @description Delete transaction
 * @route DELETE /api/transactions/:id
 * @access Private
 */
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
