import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";

const DeleteAccountTypeModal = ({
  closeModal,
  accountSubTypeId,
  deleteAccountType,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(token);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/account-sub-types/${accountSubTypeId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Delete the account type from the table data
      deleteAccountType(accountSubTypeId);
      closeModal();
      toast.success("Account type deleted successfully");
    } catch (error) {
      console.log("Error deleting account type:", error);
      setError("Error deleting account type. Please try again.");
      toast.error("An error occurred while deleting the account type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Delete Account Type</h2>
      <p className="mb-4">
        Are you sure you want to delete this account type? This action cannot be
        undone.
      </p>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 mr-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <ImSpinner2 className="animate-spin mr-2" />
              Deleting...
            </span>
          ) : (
            "Delete"
          )}
        </button>
        <button
          onClick={closeModal}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountTypeModal;
