const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerControllers");

/**
 * @description Update ledger for a transaction
 * @route POST /api/ledger/update
 * @access Private
 */
router.post("/update", ledgerController.updateLedger);

module.exports = router;
