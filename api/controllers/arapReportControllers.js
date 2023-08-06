const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const AccountType = require("../models/AccountType");
const logger = require("../config/logger");
const AccountCategory = require("../models/AccountCategory");

/**
 * Generates an asset account balances report within the specified date range,
 * including account names and total balances.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The generated asset account balances report.
 */
const getAssetAccountBalances = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Query the transactions within the specified date range
    const transactions = await Transaction.find({
      createdAt: {
        $lte: new Date(startDate),
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

    let accountArray = [];

    // Calculate the total income and total expenses
    for (const transaction of transactions) {
      // Iterate over debit accounts
      for (const debitAccount of transaction.debitAccounts) {
        if (debitAccount.accountId.accountTypeId.typeName === "assets") {
          // Check if account with the same accountId exists in accountArray
          const existingAccount = accountArray.find(
            (account) =>
              account.accountId._id.toString() ===
              debitAccount.accountId._id.toString()
          );

          if (existingAccount) {
            // If account already exists, add the amount to the existing account
            existingAccount.amount += transaction.amount;
          } else {
            // If account doesn't exist, create a new entry with accountId and amount
            accountArray.push({
              accountId: debitAccount.accountId._id,
              accountName: debitAccount.accountId.accountName,
              amount: debitAccount.amount,
            });
          }
        }
      }

      // Iterate over credit accounts
      for (const creditAccount of transaction.creditAccounts) {
        if (creditAccount.accountId.accountTypeId.typeName === "assets") {
          // Check if account with the same accountId exists in accountArray
          const existingAccount = accountArray.find(
            (account) =>
              account.accountId._id.toString() ===
              creditAccount.accountId._id.toString()
          );

          if (existingAccount) {
            // If account already exists, add the amount to the existing account
            existingAccount.amount -= creditAccount.amount;
          } else {
            // If account doesn't exist, create a new entry with accountId and amount
            accountArray.push({
              accountId: creditAccount.accountId._id,
              accountName: creditAccount.accountId.accountName,
              amount: creditAccount.amount,
            });
          }
        }
      }
    }

    const reportData = {
      startDate,
      endDate,
      accountArray,
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

/**
 * Generates a profit/loss report within the specified date range,
 * including account names and amounts for income and expense transactions.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The generated profit/loss report.
 */
const getAssetAccountClosingBalances = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Query the transactions within the specified date range
    const transactions = await Transaction.find({
      createdAt: {
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

    let accountArray = [];

    // Calculate the total income and total expenses
    for (const transaction of transactions) {
      // Iterate over debit accounts
      for (const debitAccount of transaction.debitAccounts) {
        if (debitAccount.accountId.accountTypeId.typeName === "assets") {
          // Check if account with the same accountId exists in accountArray
          const existingAccount = accountArray.find(
            (account) =>
              account.accountId._id.toString() ===
              debitAccount.accountId._id.toString()
          );

          if (existingAccount) {
            // If account already exists, add the amount to the existing account
            existingAccount.amount += transaction.amount;
          } else {
            // If account doesn't exist, create a new entry with accountId and amount
            accountArray.push({
              accountId: debitAccount.accountId._id,
              accountName: debitAccount.accountId.accountName,
              amount: debitAccount.amount,
            });
          }
        }
      }

      // Iterate over credit accounts
      for (const creditAccount of transaction.creditAccounts) {
        if (creditAccount.accountId.accountTypeId.typeName === "assets") {
          // Check if account with the same accountId exists in accountArray
          const existingAccount = accountArray.find(
            (account) =>
              account.accountId._id.toString() ===
              creditAccount.accountId._id.toString()
          );

          if (existingAccount) {
            // If account already exists, add the amount to the existing account
            existingAccount.amount -= creditAccount.amount;
          } else {
            // If account doesn't exist, create a new entry with accountId and amount
            accountArray.push({
              accountId: creditAccount.accountId._id,
              accountName: creditAccount.accountId.accountName,
              amount: creditAccount.amount,
            });
          }
        }
      }
    }

    const reportData = {
      startDate,
      endDate,
      accountArray,
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

/**
 * Generates a receivables report for KIB Bivinno Khate Aday,
 * including account names and amounts for income and expense transactions.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The generated receivables report.
 */
const getAllReceived = async (req, res) => {
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
        path: "debitAccounts.accountId",
        model: "Account",
        populate: {
          path: "accountCategoryId",
          model: "AccountCategory",
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
      .populate({
        path: "creditAccounts.accountId",
        model: "Account",
        populate: {
          path: "accountCategoryId",
          model: "AccountCategory",
        },
      })
      .lean();

    const categories = await AccountCategory.find();

    let kibReceivedAndPaid = categories.map((cat) =>
      generateCategoryArray(cat._id, cat.name, cat.type, transactions)
    );

    const reportData = {
      startDate,
      endDate,
      kibReceivedAndPaid,
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

/**
 * Generates the account category array for the receivables report.
 * @param {string} categoryId - The ID of the account category.
 * @param {string} categoryName - The name of the account category.
 * @param {string} categoryType - The type of the account category.
 * @param {Array} transactions - The list of transactions.
 * @returns {Object} - The generated category array.
 */
const generateCategoryArray = (
  categoryId,
  categoryName,
  categoryType,
  transactions
) => {
  let categoryAccountsArray = [];

  // Calculate the total income and total expenses
  for (const transaction of transactions) {
    // Iterate over debit accounts
    for (const debitAccount of transaction.debitAccounts) {
      if (
        debitAccount.accountId.accountCategoryId._id.toString() ===
        categoryId.toString()
      ) {
        // Check if account with the same accountId exists in kibReceived
        const existingAccount = categoryAccountsArray.find(
          (account) =>
            account.accountId._id.toString() ===
            debitAccount.accountId._id.toString()
        );

        if (existingAccount) {
          // If account already exists, add the amount to the existing account
          existingAccount.amount += transaction.amount;
        } else {
          // If account doesn't exist, create a new entry with accountId and amount
          categoryAccountsArray.push({
            accountId: debitAccount.accountId._id,
            accountName: debitAccount.accountId.accountName,
            amount: debitAccount.amount,
          });
        }
      }
    }

    // Iterate over credit accounts
    for (const creditAccount of transaction.creditAccounts) {
      if (
        creditAccount.accountId.accountCategoryId._id.toString() ===
        categoryId.toString()
      ) {
        // Check if account with the same accountId exists in kibRecived
        const existingAccount = categoryAccountsArray.find(
          (account) =>
            account.accountId._id.toString() ===
            creditAccount.accountId._id.toString()
        );

        if (existingAccount) {
          // If account already exists, add the amount to the existing account
          existingAccount.amount += creditAccount.amount;
        } else {
          // If account doesn't exist, create a new entry with accountId and amount
          categoryAccountsArray.push({
            accountId: creditAccount.accountId._id,
            accountName: creditAccount.accountId.accountName,
            amount: creditAccount.amount,
          });
        }
      }
    }
  }
  return {
    categoryId,
    categoryName,
    categoryAccountsArray,
    categoryType,
    categoryTotal: categoryAccountsArray.reduce(
      (prev, current) => prev + current.amount,
      0
    ),
  };
};

module.exports = {
  getAssetAccountBalances,
  getAllReceived,
  getAssetAccountClosingBalances,
};
