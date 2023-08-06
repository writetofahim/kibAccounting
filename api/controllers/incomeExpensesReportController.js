const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const AccountType = require("../models/AccountType");
const logger = require("../config/logger");

/**
 * Generates a profit/loss report within the specified date range,
 * including account names and amounts for income and expense transactions.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The generated profit/loss report.
 */
const generateProfitLossReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Query the transactions within the specified date range
    const transactions = await Transaction.find({
      createdAt: {
        $gte: startDate,
        $lte: new Date(endDate + "T23:59:59.999Z"),
      },
    })
      .populate({
        path: "debitAccounts.accountId",
        model: "Account",
        populate: {
          path: "accountTypeId",
          model: "AccountType",
        },
      })
      .populate({
        path: "creditAccounts.accountId",
        model: "Account",
        populate: {
          path: "accountTypeId",
          model: "AccountType",
        },
      })
      .lean();

    let totalIncome = 0;
    let totalExpenses = 0;

    let incomeAccounts = [];
    let expensesAccounts = [];

    // Calculate the total income and total expenses
    for (const transaction of transactions) {
      // Iterate over debit accounts
      for (const debitAccount of transaction.debitAccounts) {
        if (debitAccount.accountId.accountTypeId.typeName === "income") {
          // Calculate total income and update incomeAccounts
          totalIncome -= debitAccount.amount;

          // Check if account with the same accountId exists in incomeAccounts
          const existingAccount = incomeAccounts.find(
            (account) =>
              account.accountId._id.toString() ===
              debitAccount.accountId._id.toString()
          );

          if (existingAccount) {
            // If account already exists, add the amount to the existing account
            existingAccount.amount += debitAccount.amount;
          } else {
            // If account doesn't exist, create a new entry with accountId and amount
            incomeAccounts.push({
              accountId: debitAccount.accountId._id,
              accountName: debitAccount.accountId.accountName,
              amount: debitAccount.amount,
            });
          }
        } else if (
          debitAccount.accountId.accountTypeId.typeName === "expenses"
        ) {
          // Calculate total expenses and update expensesAccounts
          totalExpenses += debitAccount.amount;

          // Check if account with the same accountId exists in expensesAccounts
          const existingAccount = expensesAccounts.find(
            (account) =>
              account.accountId._id.toString() ===
              debitAccount.accountId._id.toString()
          );

          if (existingAccount) {
            // If account already exists, add the amount to the existing account
            existingAccount.amount += debitAccount.amount;
          } else {
            // If account doesn't exist, create a new entry with accountId and amount
            expensesAccounts.push({
              accountId: debitAccount.accountId._id,
              accountName: debitAccount.accountId.accountName,
              amount: debitAccount.amount,
            });
          }
        }
      }

      // Iterate over credit accounts
      for (const creditAccount of transaction.creditAccounts) {
        if (creditAccount.accountId.accountTypeId.typeName === "income") {
          // Calculate total income and update incomeAccounts
          totalIncome += creditAccount.amount;

          // Check if account with the same accountId exists in incomeAccounts
          const existingAccount = incomeAccounts.find(
            (account) =>
              account.accountId._id.toString() ===
              creditAccount.accountId._id.toString()
          );

          if (existingAccount) {
            // If account already exists, add the amount to the existing account
            existingAccount.amount += creditAccount.amount;
          } else {
            // If account doesn't exist, create a new entry with accountId and amount
            incomeAccounts.push({
              accountId: creditAccount.accountId._id,
              accountName: creditAccount.accountId.accountName,
              amount: creditAccount.amount,
            });
          }
        } else if (
          creditAccount.accountId.accountTypeId.typeName === "expenses"
        ) {
          // Calculate total expenses and update expensesAccounts
          totalExpenses -= creditAccount.amount;

          // Check if account with the same accountId exists in expensesAccounts
          const existingAccount = expensesAccounts.find(
            (account) =>
              account.accountId._id.toString() ===
              creditAccount.accountId._id.toString()
          );

          if (existingAccount) {
            // If account already exists, add the amount to the existing account
            existingAccount.amount += creditAccount.amount;
          } else {
            // If account doesn't exist, create a new entry with accountId and amount
            expensesAccounts.push({
              accountId: creditAccount.accountId._id,
              accountName: creditAccount.accountId.accountName,
              amount: creditAccount.amount,
            });
          }
        }
      }
    }

    const profitLoss = totalIncome - totalExpenses;

    const reportData = {
      startDate,
      endDate,
      totalIncome,
      totalExpenses,
      profitLoss,
      incomeAccounts,
      expensesAccounts,
    };

    logger.info("Profit/loss report generated successfully");
    res.status(200).json({
      success: true,
      reportData,
    });
  } catch (error) {
    logger.error("Failed to generate profit/loss report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate profit/loss report",
    });
  }
};

module.exports = {
  generateProfitLossReport,
};
