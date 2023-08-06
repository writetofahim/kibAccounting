/**
 * @description Account type routes
 * @routes /api/account-types
 */

const express = require("express");
const router = express.Router();
const accountTypeController = require("../controllers/accountTypeControllers");

/**
 * @description Get all account types
 * @route GET /api/account-types
 * @access Private
 * @return {json} - Status and JSON { success:true, accountTypes:array }
 */
router.get("/", accountTypeController.getAccountTypes);

/**
 * @description Create a new account type
 * @route POST /api/account-types
 * @access Private
 * @params {string} typeName - The account type name
 * @params {string} [description] - The account type description (optional)
 * @return {json} - Status and JSON { success:true, accountType:object }
 */
router.post("/", accountTypeController.createAccountType);

/**
 * @description Update an account type
 * @route PUT /api/account-types/:id
 * @access Private
 * @params {string} id - The account type ID
 * @params {string} typeName - The updated account type name
 * @params {string} [description] - The updated account type description (optional)
 * @return {json} - Status and JSON { success:true, accountType:object }
 */
router.put("/:id", accountTypeController.updateAccountType);

/**
 * @description Delete an account type
 * @route DELETE /api/account-types/:id
 * @access Private
 * @params {string} id - The account type ID
 * @return {json} - Status and JSON { success:true, message:string }
 */
router.delete("/:id", accountTypeController.deleteAccountType);

module.exports = router;
