const express = require("express");
const router = express.Router();
const incomeExpensesReportController = require("../controllers/incomeExpensesReportController");
const ledgerReportController = require("../controllers/ledgerReportController");
const arapReportControllers = require("../controllers/arapReportControllers");

/**
 * @description Generate profit/loss report
 * @route GET /api/reports/profit-loss
 * @access Public
 * @queryParam {string} startDate - Start date of the report (format: YYYY-MM-DD)
 * @queryParam {string} endDate - End date of the report (format: YYYY-MM-DD)
 */
router.get(
  "/profit-loss",
  incomeExpensesReportController.generateProfitLossReport
);

/**
 * @description Generate ledger report for individual accounts
 * @route GET /api/reports/ledger
 * @access Public
 * @queryParam {string} accountId - Account ID for the ledger report
 * @queryParam {string} startDate - Start date of the report (format: YYYY-MM-DD)
 * @queryParam {string} endDate - End date of the report (format: YYYY-MM-DD)
 */
router.get("/ledger", ledgerReportController.generateLedgerReport);

/**
 * @description Generate Accounts Receivable/Payable report for asset account balances.
 * @route GET /api/reports/arap/assets
 * @access Public
 * @queryParam {string} startDate - Start date of the report (format: YYYY-MM-DD)
 * @queryParam {string} endDate - End date of the report (format: YYYY-MM-DD)
 */
router.get("/arap/assets", arapReportControllers.getAssetAccountBalances);

/**
 * @description Generate Accounts Receivable/Payable report for all received transactions.
 * @route GET /api/reports/received
 * @access Public
 * @queryParam {string} startDate - Start date of the report (format: YYYY-MM-DD)
 * @queryParam {string} endDate - End date of the report (format: YYYY-MM-DD)
 */
router.get("/arap/received", arapReportControllers.getAllReceived);

/**
 * @description Generate Accounts Receivable/Payable report for closing asset account balances.
 * @route GET /api/reports/closingAsset
 * @access Public
 * @queryParam {string} startDate - Start date of the report (format: YYYY-MM-DD)
 * @queryParam {string} endDate - End date of the report (format: YYYY-MM-DD)
 */
router.get(
  "/arap/closingAsset",
  arapReportControllers.getAssetAccountClosingBalances
);

module.exports = router;
