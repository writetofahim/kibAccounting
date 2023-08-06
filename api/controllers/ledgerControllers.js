const Transaction = require("../models/Transaction");
const Ledger = require("../models/Ledger");
const logger = require("../config/logger");

/**
 * @description Update ledger for a transaction
 * @route POST /api/ledger/update
 * @access Private
 * @param {string} transactionId - The ID of the transaction
 */
const updateLedger = async (req, res) => {
  try {
    const { transactionId } = req.body;

    // Get the transaction
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Update the ledgers for debit accounts
    for (const debitAccount of transaction.debitAccounts) {
      const debitAccountLedger = await Ledger.findOne({
        accountId: debitAccount.accountId,
      });

      if (!debitAccountLedger) {
        return res.status(404).json({
          success: false,
          message: "Debit account ledger not found",
        });
      }

      debitAccountLedger.balance -= debitAccount.amount;
      debitAccountLedger.lastUpdated = Date.now();

      await debitAccountLedger.save();
    }

    // Update the ledgers for credit accounts
    for (const creditAccount of transaction.creditAccounts) {
      const creditAccountLedger = await Ledger.findOne({
        accountId: creditAccount.accountId,
      });

      if (!creditAccountLedger) {
        return res.status(404).json({
          success: false,
          message: "Credit account ledger not found",
        });
      }

      creditAccountLedger.balance += creditAccount.amount;
      creditAccountLedger.lastUpdated = Date.now();

      await creditAccountLedger.save();
    }

    logger.info("Ledgers updated successfully");
    return res.status(200).json({
      success: true,
      message: "Ledgers updated successfully",
    });
  } catch (error) {
    logger.error("Failed to update ledgers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  updateLedger,
};
