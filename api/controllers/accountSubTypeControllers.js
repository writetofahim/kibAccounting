const AccountSubType = require("../models/AccountSubType");
const logger = require("../config/logger");

/**
 * @description Create a new account sub-type
 * @route POST /api/account-sub-types
 * @access Private
 * @param {string} subTypeName - The sub-type name
 * @param {string} accountTypeId - The account type ID
 * @param {string} description - The sub-type description
 * @returns {json} - Status and JSON { success:true, message:string, object }
 */
const createAccountSubType = async (req, res) => {
  try {
    const { subTypeName, accountTypeId, description } = req.body;

    const newAccountSubType = new AccountSubType({
      subTypeName,
      accountTypeId,
      description,
    });

    await newAccountSubType.save();

    logger.info("Creating a new account sub-type", {
      subTypeName,
      accountTypeId,
      description,
    });

    logger.info("Account sub-type created successfully", {
      newAccountSubType,
    });

    return res.status(201).json({
      success: true,
      message: "Account sub-type created successfully",
      newAccountSubType,
    });
  } catch (error) {
    logger.error("Failed to create account sub-type", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Get all account sub-types by account type ID
 * @route GET /api/account-sub-types?accountTypeId=:id
 * @access Private
 * @param {string} id - The account type ID
 * @returns {json} - Status and JSON { success:true, accountSubTypes:array }
 */
const getAllAccountSubTypes = async (req, res) => {
  try {
    const { accountTypeId } = req.query;
    let query = {};

    if (accountTypeId) {
      query = { accountTypeId };
    }

    const accountSubTypes = await AccountSubType.find(query).populate(
      "accountTypeId"
    );

    logger.info("Retrieved all account sub-types", {
      count: accountSubTypes.length,
    });

    return res.status(200).json({
      success: true,
      accountSubTypes,
    });
  } catch (error) {
    logger.error("Failed to get account sub-types", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Get account sub-type by ID
 * @route GET /api/account-sub-types/:id
 * @access Private
 * @param {string} id - The account sub-type ID
 * @returns {json} - Status and JSON { success:true, accountSubType:object }
 */
const getAccountSubTypeById = async (req, res) => {
  try {
    const accountSubType = await AccountSubType.findById(req.params.id);

    if (!accountSubType) {
      logger.warn("Account sub-type not found", {
        accountSubTypeId: req.params.id,
      });

      return res.status(404).json({
        success: false,
        message: "Account sub-type not found",
      });
    }

    logger.info("Retrieved account sub-type by ID", {
      accountSubTypeId: req.params.id,
      accountSubType,
    });

    return res.status(200).json({
      success: true,
      accountSubType,
    });
  } catch (error) {
    logger.error("Failed to get account sub-type", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Update account sub-type
 * @route PUT /api/account-sub-types/:id
 * @access Private
 * @param {string} id - The account sub-type ID
 * @param {string} subTypeName - The sub-type name
 * @param {string} accountTypeId - The account type ID
 * @param {string} description - The sub-type description
 * @returns {json} - Status and JSON { success:true, message:string, object }
 */
const updateAccountSubType = async (req, res) => {
  try {
    const { subTypeName, accountTypeId, description } = req.body;

    const updatedAccountSubType = await AccountSubType.findByIdAndUpdate(
      req.params.id,
      {
        subTypeName,
        accountTypeId,
        description,
      },
      { new: true }
    );

    if (!updatedAccountSubType) {
      logger.warn("Account sub-type not found for update", {
        accountSubTypeId: req.params.id,
      });

      return res.status(404).json({
        success: false,
        message: "Account sub-type not found",
      });
    }

    logger.info("Account sub-type updated successfully", {
      accountSubTypeId: req.params.id,
      updatedAccountSubType,
    });

    return res.status(200).json({
      success: true,
      message: "Account sub-type updated successfully",
      updatedAccountSubType,
    });
  } catch (error) {
    logger.error("Failed to update account sub-type", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description Delete account sub-type
 * @route DELETE /api/account-sub-types/:id
 * @access Private
 * @param {string} id - The account sub-type ID
 * @returns {json} - Status and JSON { success:true, message:string, object }
 */
const deleteAccountSubType = async (req, res) => {
  try {
    const deletedAccountSubType = await AccountSubType.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAccountSubType) {
      logger.warn("Account sub-type not found for deletion", {
        accountSubTypeId: req.params.id,
      });

      return res.status(404).json({
        success: false,
        message: "Account sub-type not found",
      });
    }

    logger.info("Account sub-type deleted successfully", {
      accountSubTypeId: req.params.id,
      deletedAccountSubType,
    });

    return res.status(200).json({
      success: true,
      message: "Account sub-type deleted successfully",
      deletedAccountSubType,
    });
  } catch (error) {
    logger.error("Failed to delete account sub-type", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAccountSubType,
  getAllAccountSubTypes,
  getAccountSubTypeById,
  updateAccountSubType,
  deleteAccountSubType,
};
