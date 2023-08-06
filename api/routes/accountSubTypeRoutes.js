/**
 * @description Account Sub-Type routes
 * @routes /api/account-sub-types
 */

const express = require("express");
const router = express.Router();
const accountSubTypeController = require("../controllers/accountSubTypeControllers");

/**
 * @description Create a new account sub-type
 * @route POST /api/account-sub-types
 * @access Private
 * @param {string} subTypeName - The sub-type name
 * @param {string} accountTypeId - The account type ID
 * @param {string} description - The sub-type description
 * @returns {json} - Status and JSON { success:true, message:string, object }
 */
router.post("/", accountSubTypeController.createAccountSubType);

/**
 * @description Get all account sub-types
 * @route GET /api/account-sub-types
 * @access Private
 * @returns {json} - Status and JSON { success:true, accountSubTypes:array }
 */
router.get("/", accountSubTypeController.getAllAccountSubTypes);

/**
 * @description Get account sub-type by ID
 * @route GET /api/account-sub-types/:id
 * @access Private
 * @param {string} id - The account sub-type ID
 * @returns {json} - Status and JSON { success:true, accountSubType:object }
 */
router.get("/:id", accountSubTypeController.getAccountSubTypeById);

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
router.put("/:id", accountSubTypeController.updateAccountSubType);

/**
 * @description Delete account sub-type
 * @route DELETE /api/account-sub-types/:id
 * @access Private
 * @param {string} id - The account sub-type ID
 * @returns {json} - Status and JSON { success:true, message:string, object }
 */
router.delete("/:id", accountSubTypeController.deleteAccountSubType);

module.exports = router;
