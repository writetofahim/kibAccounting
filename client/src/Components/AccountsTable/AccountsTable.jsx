import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../../Components/Modal/Modal";
import axios from "../../utils/axiosInstance";
import AccountForm from "../AccountForm/AccountForm";
import TableLoadingSkeleton from "../TableLoadingSkeleton/TableLoadingSkeleton";

const AccountsTable = ({ selectedAccountType }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDeleteModalIndex, setOpenDeleteModalIndex] = useState(-1);
  const [openEditModalIndex, setOpenEditModalIndex] = useState(-1);

  const token = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(token);

  useEffect(() => {
    axios
      .get(`/accounts?accountType=${selectedAccountType.typeName}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setTableData(res.data.accounts))
      .catch((err) => {
        console.log(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedAccountType]);

  if (loading) {
    return <TableLoadingSkeleton columns={5} rows={3} />;
  }
  if (!loading && error) {
    return <div className="bg-white py-3 px-3 text-red-500">{error}</div>;
  }
  if (tableData.length === 0) {
    return <div className="bg-white py-3 px-3">Nothing found</div>;
  }

  const openDeleteModal = (index) => {
    setOpenDeleteModalIndex(index);
  };

  const closeDeleteModal = () => {
    setOpenDeleteModalIndex(-1);
  };

  const openEditModal = (index) => {
    setOpenEditModalIndex(index);
  };

  const closeEditModal = () => {
    setOpenEditModalIndex(-1);
  };

  const handleDeleteAccount = async (accountId) => {
    console.log(accountId);
    try {
      await axios.delete(`/accounts/${accountId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTableData((prevData) =>
        prevData.filter((account) => account._id !== accountId)
      );
      toast.success("Account deleted successfully");
      closeDeleteModal();
    } catch (error) {
      // Handle the error
      console.log("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Account Name
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Account Type
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 ml-1"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 320 512"
                  >
                    <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Account Subtype
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 ml-1"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 320 512"
                  >
                    <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Amount
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 ml-1"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 320 512"
                  >
                    <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={data._id} className="bg-white border-b ">
              <td className="px-6 py-4">{data.accountName}</td>
              <td className="px-6 py-4 capitalize">
                {data.accountTypeId.typeName}
              </td>
              <td className="px-6 py-4">{data.accountSubTypeId.subTypeName}</td>
              <td className="px-6 py-4">
                {data.accountTypeId.typeName === "income"
                  ? data.currentBalance * -1
                  : data.currentBalance}
              </td>
              <td className="px-6 py-4 text-right flex gap-3">
                <button
                  onClick={() => openEditModal(index)}
                  className="font-medium text-blue-600  hover:underline"
                >
                  Edit
                </button>
                {/* <button
                  onClick={() => openDeleteModal(index)}
                  className="font-medium text-red-600  hover:underline"
                >
                  Delete
                </button> */}

                {openDeleteModalIndex === index && (
                  <Modal isOpen={true} onClose={closeDeleteModal}>
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl">Confirm Delete</h2>
                    </div>
                    <p className="my-4">
                      Are you sure you want to delete this account?
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDeleteAccount(data._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={closeDeleteModal}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </Modal>
                )}
                {openEditModalIndex === index && (
                  <Modal isOpen={true} onClose={closeEditModal}>
                    <div className="bg-black/50 backdrop-blur-sm md:w-[600px] ">
                      <div className="bg-white p-3">
                        <h3 className="text-center font-semibold text-xl">
                          Edit Account
                        </h3>
                        <AccountForm account={data} />
                      </div>
                    </div>
                  </Modal>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;
