const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const logger = require("../config/logger");

/**
 * @description Create a new transaction
 * @route POST /api/transactions
 * @access Private
 * @param {string} description - The transaction description
 * @param {Array} debitAccounts - Array of debit accounts with account ID and amount
 * @param {Array} creditAccounts - Array of credit accounts with account ID and amount
 * @param {string} createdBy - The user ID of the creator
 * @param {boolean} [isPosted] - Flag indicating if the transaction is posted (optional)
 * @param {string} [notes] - Additional notes for the transaction (optional)
 * @param {string} transactionType - The type of transaction ("Transfer", "Debit", "Credit")
 * @param {string} paymentType - The payment type ("Cash", "Bank")
 * @returns {json} - Status and JSON { success: true, message: string, transaction: object }
 */
const createTransaction = async (req, res) => {
  try {
    const {
      description,
      debitAccounts,
      creditAccounts,
      createdBy,
      isPosted = false,
      notes = "",
      transactionType,
      paymentType,
    } = req.body;

    // Calculate the total debit and credit amounts
    const totalDebitAmount = debitAccounts.reduce(
      (sum, account) => sum + account.amount,
      0
    );
    const totalCreditAmount = creditAccounts.reduce(
      (sum, account) => sum + account.amount,
      0
    );

    // Check if the total debit amount equals the total credit amount
    if (totalDebitAmount !== totalCreditAmount) {
      console.log("Debit and credit amounts are not balanced");
      return res.status(400).json({
        success: false,
        message: "Debit and credit amounts are not balanced",
      });
    }

    let amount = totalDebitAmount;

    const newTransaction = new Transaction({
      description,
      debitAccounts,
      creditAccounts,
      createdBy,
      isPosted,
      amount,
      notes,
      transactionType,
      paymentType,
    });

    // Update the current balance of the debit accounts
    for (const debitAccount of debitAccounts) {
      const account = await Account.findById(debitAccount.accountId);

      if (!account) {
        console.log("Debit account not found");
        return res.status(404).json({
          success: false,
          message: "Debit account not found",
        });
      }

      account.currentBalance += debitAccount.amount;
      await account.save();
    }

    // Update the current balance of the credit accounts
    for (const creditAccount of creditAccounts) {
      const account = await Account.findById(creditAccount.accountId);

      if (!account) {
        console.log("Credit account not found");
        return res.status(404).json({
          success: false,
          message: "Credit account not found",
        });
      }

      account.currentBalance -= creditAccount.amount;
      await account.save();
    }

    await newTransaction.save();

    console.log("Transaction created successfully");
    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Get all transactions
 * @route GET /api/transactions
 * @access Private
 * @returns {json} - Status and JSON { success: true, transactions: array }
 */
const getAllTransactions = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    let query = {};

    if (startDate && endDate) {
      // Adjusting the date range query to include the end date
      query = {
        createdAt: {
          $gte: startDate,
          $lte: new Date(endDate + "T23:59:59.999Z"),
        },
      };
    }

    const transactions = await Transaction.find(query)
      .populate({
        path: "debitAccounts.accountId",
        model: "Account",
      })
      .populate({
        path: "creditAccounts.accountId",
        model: "Account",
      })
      .lean();

    logger.info("Transactions retrieved successfully");

    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    logger.error("Failed to get transactions", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Get transaction by ID
 * @route GET /api/transactions/:id
 * @access Private
 * @param {string} id - The transaction ID
 * @returns {json} - Status and JSON { success: true, transaction: object }
 */
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      console.log("Transaction not found");
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    console.log("Transaction retrieved successfully");
    return res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Failed to get transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Update transaction
 * @route PUT /api/transactions/:id
 * @access Private
 * @param {string} id - The transaction ID
 * @param {string} description - The transaction description
 * @param {string} debitAccount - The debit account ID
 * @param {string} creditAccount - The credit account ID
 * @param {number} amount - The transaction amount
 * @param {boolean} isPosted - Flag indicating if the transaction is posted
 * @param {string} notes - Additional notes for the transaction
 * @param {string} transactionType - The type of transaction ("Transfer", "Debit", "Credit")
 * @param {string} paymentType - The payment type ("Cash", "Bank")
 * @returns {json} - Status and JSON { success: true, message: string, transaction: object }
 */
const updateTransaction = async (req, res) => {
  try {
    const {
      description,
      debitAccount,
      creditAccount,
      amount,
      isPosted,
      notes,
      transactionType,
      paymentType,
    } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        description,
        debitAccount,
        creditAccount,
        amount,
        isPosted,
        notes,
        transactionType,
        paymentType,
      },
      { new: true }
    );

    if (!updatedTransaction) {
      console.log("Transaction not found");
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    console.log("Transaction updated successfully");
    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Failed to update transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Delete transaction
 * @route DELETE /api/transactions/:id
 * @access Private
 * @param {string} id - The transaction ID
 * @returns {json} - Status and JSON { success: true, message: string, transaction: object }
 */
const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTransaction) {
      console.log("Transaction not found");
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    console.log("Transaction deleted successfully");
    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      transaction: deletedTransaction,
    });
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
