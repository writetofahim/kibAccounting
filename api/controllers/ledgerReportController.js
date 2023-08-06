const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const AccountType = require("../models/AccountType");
const logger = require("../config/logger");

/**
 * Generates a ledger report for individual accounts within the specified date range.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The generated ledger report.
 */
const generateLedgerReport = async (req, res) => {
  const { accountId, startDate, endDate } = req.query;

  try {
    // Query the transactions for the specified account and date range
    const transactions = await Transaction.find({
      $and: [
        {
          createdAt: {
            $gte: startDate,
            $lte: new Date(endDate + "T23:59:59.999Z"),
          },
        },
        {
          $or: [
            { "debitAccounts.accountId": accountId },
            { "creditAccounts.accountId": accountId },
          ],
        },
      ],
    })
      .populate({
        path: "debitAccounts.accountId",
        model: "Account",
      })
      .populate({
        path: "creditAccounts.accountId",
        model: "Account",
      })
      .lean();

    // Filter transactions related to the specified account
    const filteredTransactions = transactions.filter((transaction) => {
      const isDebitAccount = transaction.debitAccounts.some(
        (debitAccount) =>
          debitAccount.accountId &&
          debitAccount.accountId._id.toString() === accountId
      );

      const isCreditAccount = transaction.creditAccounts.some(
        (creditAccount) =>
          creditAccount.accountId &&
          creditAccount.accountId._id.toString() === accountId
      );

      return isDebitAccount || isCreditAccount;
    });

    // Calculate the running balance for each transaction
    let runningBalance = 0;

    const debitEntries = [];
    const creditEntries = [];

    filteredTransactions.forEach((transaction) => {
      let debitAmount = 0;
      let creditAmount = 0;

      transaction.debitAccounts.forEach((debitAccount) => {
        if (debitAccount.accountId._id.toString() === accountId) {
          debitAmount = debitAccount.amount;
        }
      });

      transaction.creditAccounts.forEach((creditAccount) => {
        if (creditAccount.accountId._id.toString() === accountId) {
          creditAmount = creditAccount.amount;
        }
      });

      const entryAmount = creditAmount - debitAmount;
      runningBalance += entryAmount;

      const entry = {
        transactionId: transaction._id,
        transactionDate: transaction.createdAt,
        transactionDetails: transaction.description,
        entryAmount,
        runningBalance,
      };

      if (entryAmount < 0) {
        debitEntries.push({
          ...entry,
          accountName: transaction.creditAccounts[0].accountId.accountName,
        });
      } else {
        creditEntries.push({
          ...entry,
          accountName: transaction.debitAccounts[0].accountId.accountName,
        });
      }
    });

    // Retrieve account details
    const account = await Account.findById(accountId).lean();

    const reportData = {
      account,
      startDate,
      endDate,
      debitEntries,
      creditEntries,
    };
    logger.info("Success", reportData);
    res.status(200).json({
      success: true,
      reportData,
    });
  } catch (error) {
    logger.error("Failed to generate ledger report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate ledger report",
    });
  }
};

module.exports = {
  generateLedgerReport,
};
