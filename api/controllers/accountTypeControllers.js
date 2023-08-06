const AccountType = require("../models/AccountType");
const logger = require("../config/logger");

/**
 * @description Get all account types
 * @route GET /api/account-types
 * @access Private
 * @return {json} - Status and JSON { success:true, accountTypes:array }
 */
const getAccountTypes = async (req, res) => {
  try {
    const accountTypes = await AccountType.find();
    return res.status(200).json({ success: true, accountTypes });
  } catch (error) {
    logger.error("Failed to get account types:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * @description Create a new account type
 * @route POST /api/account-types
 * @access Private
 * @params {string} typeName - The account type name
 * @params {string} [description] - The account type description (optional)
 * @return {json} - Status and JSON { success:true, accountType:object }
 */
const createAccountType = async (req, res) => {
  try {
    const { typeName, description } = req.body;

    const accountType = new AccountType({ typeName, description });
    await accountType.save();

    logger.info("Account type created successfully");
    return res.status(201).json({ success: true, accountType });
  } catch (error) {
    logger.error("Failed to create account type:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * @description Update an account type
 * @route PUT /api/account-types/:id
 * @access Private
 * @params {string} id - The account type ID
 * @params {string} typeName - The updated account type name
 * @params {string} [description] - The updated account type description (optional)
 * @return {json} - Status and JSON { success:true, accountType:object }
 */
const updateAccountType = async (req, res) => {
  try {
    const { id } = req.params;
    const { typeName, description } = req.body;

    const accountType = await AccountType.findByIdAndUpdate(
      id,
      { typeName, description },
      { new: true }
    );

    if (!accountType) {
      logger.error("Account type not found");
      return res
        .status(404)
        .json({ success: false, message: "Account type not found" });
    }

    logger.info("Account type updated successfully");
    return res.status(200).json({ success: true, accountType });
  } catch (error) {
    logger.error("Failed to update account type:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * @description Delete an account type
 * @route DELETE /api/account-types/:id
 * @access Private
 * @params {string} id - The account type ID
 * @return {json} - Status and JSON { success:true, message:string }
 */
const deleteAccountType = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAccountType = await AccountType.findByIdAndDelete(id);

    if (!deletedAccountType) {
      logger.error("Account type not found");
      return res
        .status(404)
        .json({ success: false, message: "Account type not found" });
    }

    logger.info("Account type deleted successfully");
    return res
      .status(200)
      .json({ success: true, message: "Account type deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete account type:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAccountTypes,
  createAccountType,
  updateAccountType,
  deleteAccountType,
};
