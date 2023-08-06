import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";

const EditAccountTypeModal = ({
  closeModal,
  accountTypeId,
  typeName,
  description,
  updateAccountType,
}) => {
  const [updatedTypeName, setUpdatedTypeName] = useState(typeName || "");
  const [updatedDescription, setUpdatedDescription] = useState(
    description || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(token);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (accountTypeId) {
        // Edit existing account type
        await axios.put(
          `/account-types/${accountTypeId}`,
          {
            typeName: updatedTypeName,
            description: updatedDescription,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Update the table data with the updated account type
        updateAccountType(accountTypeId, updatedTypeName, updatedDescription);
      } else {
        // Add new account type
        const response = await axios.post(
          `/account-types`,
          {
            typeName: updatedTypeName,
            description: updatedDescription,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Add the new account type to the table data
        const newAccountType = response.data.accountType;
        updateAccountType(
          newAccountType._id,
          newAccountType.typeName,
          newAccountType.description
        );
      }
      closeModal();
      toast.success(
        accountTypeId
          ? "Account type updated successfully"
          : "Account type added successfully"
      );
    } catch (error) {
      console.log("Error updating account type:", error);
      setError("Error updating account type. Please try again.");
      toast.error("An error occurred while updating the account type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:w-[400px] w-full">
      <h2 className="text-lg font-bold mb-4">
        {accountTypeId ? "Edit Account Type" : "Add Account Type"}
      </h2>
      <div className="mb-4">
        <label htmlFor="typeName" className="block mb-2 font-medium">
          Type Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="typeName"
          value={updatedTypeName}
          onChange={(e) => setUpdatedTypeName(e.target.value)}
          placeholder="Enter the account type name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2 font-medium">
          Description<span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={updatedDescription}
          onChange={(e) => setUpdatedDescription(e.target.value)}
          placeholder="Enter a short description about the account type"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <ImSpinner2 className="animate-spin mr-2" />
              Loading...
            </span>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default EditAccountTypeModal;
