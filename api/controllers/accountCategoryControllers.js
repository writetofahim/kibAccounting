const AccountCategory = require("../models/AccountCategory");
const logger = require("../config/logger");

/**
 * Create a new Account Category.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The created Account Category.
 */
const createAccountCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newAccountCategory = await AccountCategory.create({
      name,
      description,
    });

    logger.info("Account Category created successfully", newAccountCategory);

    res.status(201).json({
      success: true,
      accountCategory: newAccountCategory,
    });
  } catch (error) {
    logger.error("Failed to create Account Category", error);

    res.status(500).json({
      success: false,
      message: "Failed to create Account Category",
    });
  }
};

/**
 * @description Get all account categories
 * @route GET /api/account-categories
 * @access Public
 */
const getAllAccountCategories = async (req, res) => {
  try {
    const accountCategories = await AccountCategory.find();

    res.status(200).json({
      success: true,
      accountCategories,
    });
  } catch (error) {
    console.error("Failed to get account categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get account categories",
    });
  }
};

/**
 * Update an existing Account Category by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The updated Account Category.
 */
const updateAccountCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, type } = req.body;

  try {
    const updatedAccountCategory = await AccountCategory.findByIdAndUpdate(
      id,
      {
        name,
        description,
        type,
      },
      { new: true }
    );

    if (!updatedAccountCategory) {
      return res.status(404).json({
        success: false,
        message: "Account Category not found",
      });
    }

    logger.info(
      "Account Category updated successfully",
      updatedAccountCategory
    );

    res.status(200).json({
      success: true,
      accountCategory: updatedAccountCategory,
    });
  } catch (error) {
    logger.error("Failed to update Account Category", error);

    res.status(500).json({
      success: false,
      message: "Failed to update Account Category",
    });
  }
};

/**
 * Delete an existing Account Category by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The deleted Account Category.
 */
const deleteAccountCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAccountCategory = await AccountCategory.findByIdAndDelete(id);

    if (!deletedAccountCategory) {
      return res.status(404).json({
        success: false,
        message: "Account Category not found",
      });
    }

    logger.info(
      "Account Category deleted successfully",
      deletedAccountCategory
    );

    res.status(200).json({
      success: true,
      accountCategory: deletedAccountCategory,
    });
  } catch (error) {
    logger.error("Failed to delete Account Category", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete Account Category",
    });
  }
};

module.exports = {
  createAccountCategory,
  getAllAccountCategories,
  updateAccountCategory,
  deleteAccountCategory,
};
