const Account = require("../models/Account");
const logger = require("../config/logger");

/**
 * @description Create a new account
 * @route POST /api/accounts
 * @access Private
 * @param {string} accountName - The account name
 * @param {string} accountTypeId - The account type ID
 * @param {string} accountSubTypeId - The account sub-type ID
 * @param {number} openingBalance - The opening balance
 * @param {string} createdBy - The user ID of the creator
 * @param {boolean} [isActive=true] - The account status (optional, default is true)
 * @param {string} [description] - The account description (optional)
 * @returns {json} - Status and JSON { success:true, message:string, object }
 */
const createAccount = async (req, res) => {
  try {
    const {
      accountName,
      accountTypeId,
      accountSubTypeId,
      openingBalance,
      createdBy,
      isActive = true,
      description,
      accountCategoryId,
    } = req.body;

    const newAccount = new Account({
      accountName,
      accountTypeId,
      accountSubTypeId,
      openingBalance,
      currentBalance: openingBalance || 0,
      createdBy,
      isActive,
      description,
      accountCategoryId,
    });

    await newAccount.save();

    logger.info("Creating a new account", {
      accountName,
      accountTypeId,
      accountSubTypeId,
      openingBalance,
      createdBy,
      isActive,
      description,
      accountCategoryId,
    });

    logger.info("Account created successfully", {
      newAccount,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      newAccount,
    });
  } catch (error) {
    logger.error("Failed to create account", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Get all accounts
 * @route GET /api/accounts
 * @access Private
 * @returns {json} - Status and JSON { success:true, accounts:array }
 */
const getAllAccounts = async (req, res) => {
  try {
    let accounts = await Account.find()
      .populate({ path: "accountTypeId", model: "AccountType" })
      .populate({ path: "accountCategoryId", model: "AccountCategory" })
      .populate({ path: "accountSubTypeId", model: "AccountSubType" })
      .lean();

    // Filter accounts based on account type name
    const { accountType } = req.query;
    if (accountType) {
      accounts = accounts.filter(
        (account) => account.accountTypeId.typeName === accountType
      );
    }

    logger.info("Retrieved all accounts", {
      count: accounts.length,
    });

    return res.status(200).json({
      success: true,
      accounts,
    });
  } catch (error) {
    console.log(error);
    logger.error("Failed to get accounts", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Get account by ID
 * @route GET /api/accounts/:id
 * @access Private
 * @param {string} id - The account ID
 * @returns {json} - Status and JSON { success:true, account:object }
 */

const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      logger.warn("Account not found", {
        accountId: req.params.id,
      });

      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    logger.info("Retrieved account by ID", {
      accountId: req.params.id,
      account,
    });

    return res.status(200).json({
      success: true,
      account,
    });
  } catch (error) {
    logger.error("Failed to get account", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Update account
 * @route PUT /api/accounts/:id
 * @access Private
 * @param {string} id - The account ID
 * @param {string} accountName - The account name
 * @param {string} accountTypeId - The account type ID
 * @param {string} accountSubTypeId - The account sub-type ID
 * @param {string} accountCategoryId - The account category ID
 * @param {number} openingBalance - The opening balance
 * @param {string} createdBy - The user ID of the creator
 * @param {boolean} [isActive=true] - The account status (optional, default is true)
 * @param {string} [description] - The account description (optional)
 * @returns {json} - Status and JSON { success:true, message:string, object }
 */
const updateAccount = async (req, res) => {
  try {
    const {
      accountName,
      accountTypeId,
      accountSubTypeId,
      accountCategoryId,
      openingBalance,
      createdBy,
      isActive = true,
      description,
    } = req.body;

    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      {
        accountName,
        accountTypeId,
        accountSubTypeId,
        accountCategoryId,
        openingBalance,
        createdBy,
        isActive,
        description,
      },
      { new: true }
    );

    if (!updatedAccount) {
      logger.warn("Account not found for update", {
        accountId: req.params.id,
      });

      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    logger.info("Account updated successfully", {
      accountId: req.params.id,
      updatedAccount,
    });

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      updatedAccount,
    });
  } catch (error) {
    logger.error("Failed to update account", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Delete account
 * @route DELETE /api/accounts/:id
 * @access Private
 * @param {string} id - The account ID
 * @returns {json} - Status and JSON { success:true, message:string, object }
 */
const deleteAccount = async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);

    if (!deletedAccount) {
      logger.warn("Account not found for deletion", {
        accountId: req.params.id,
      });

      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    logger.info("Account deleted successfully", {
      accountId: req.params.id,
      deletedAccount,
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      deletedAccount,
    });
  } catch (error) {
    logger.error("Failed to delete account", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
