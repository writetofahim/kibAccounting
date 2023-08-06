import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";

const EditSubTypeModal = ({
  accountSubTypeId,
  subTypeName,
  description,
  typeId,
  closeModal,
  updateAccountSubType,
}) => {
  const [updatedSubTypeName, setUpdatedSubTypeName] = useState(
    subTypeName || ""
  );
  const [updatedDescription, setUpdatedDescription] = useState(
    description || ""
  );
  const [selectedAccountTypeId, setSelectedAccountTypeId] = useState(
    typeId || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(token);

  const [accountTypes, setAccountTypes] = useState([]);

  useEffect(() => {
    axios
      .get(`/account-types`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setAccountTypes(res.data.accountTypes);
        console.log(res.data.accountTypes);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      })
      .finally(() => {});
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (accountSubTypeId) {
        // Edit existing account type
        await axios.put(
          `/account-sub-types/${accountSubTypeId}`,
          {
            subTypeName: updatedSubTypeName,
            description: updatedDescription,
            accountTypeId: selectedAccountTypeId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Update the table data with the updated account type
        updateAccountSubType(
          accountSubTypeId,
          updatedSubTypeName,
          updatedDescription,
          accountTypes.find((a) => a._id === selectedAccountTypeId)
        );
      } else {
        // Add new account type
        const response = await axios.post(
          `/account-sub-types`,
          {
            subTypeName: updatedSubTypeName,
            description: updatedDescription,
            accountTypeId: selectedAccountTypeId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Add the new account type to the table data
        const newAccountType = response.data.newAccountSubType;
        // console.log(newAccountType);
        updateAccountSubType(
          newAccountType._id,
          updatedSubTypeName,
          updatedDescription,
          accountTypes.find((a) => a._id === selectedAccountTypeId)
        );
      }
      closeModal();
      toast.success(
        accountSubTypeId
          ? "Account sub type updated successfully"
          : "Account sub type added successfully"
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
        {accountSubTypeId ? "Edit Account Sub-Type" : "Add Account Sub-Type"}
      </h2>
      <div className="mb-4">
        <label htmlFor="accountType" className="block mb-2 font-medium">
          Account Type<span className="text-red-500">*</span>
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 capitalize"
          id="accountType"
          onChange={(e) => setSelectedAccountTypeId(e.target.value)}
          value={selectedAccountTypeId}
          required
        >
          <option value="">Select an account type</option>
          {accountTypes.map((accountType) => (
            <option
              key={accountType._id}
              value={accountType._id}
              className="capitalize"
            >
              {accountType.typeName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="subType" className="block mb-2 font-medium">
          SubType Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subType"
          value={updatedSubTypeName}
          onChange={(e) => setUpdatedSubTypeName(e.target.value)}
          placeholder="Enter account subtype name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
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
          placeholder="enter a short description about the account syb-type"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        ></textarea>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
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

export default EditSubTypeModal;
