import React, { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal";
import axios from "../../utils/axiosInstance";
import TableLoadingSkeleton from "../TableLoadingSkeleton/TableLoadingSkeleton";
import DeleteSubTypeModal from "./DeleteSubTypeModal";
import EditSubTypeModal from "./EditSubTypeModal";

const AccountSubTypesTable = ({ tableData, setTableData }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openEditModalIndex, setOpenEditModalIndex] = useState(-1);
  const [openDeleteModalIndex, setOpenDeleteModalIndex] = useState(-1);

  const token = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(token);

  useEffect(() => {
    axios
      .get(`/account-sub-types`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setTableData(res.data.accountSubTypes))
      .catch((err) => {
        console.log(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!loading && error) {
    return <div className="bg-white py-3 px-3 text-red-500">{error}</div>;
  }
  if (!loading && tableData?.length === 0) {
    return <div className="bg-white py-3 px-3">Nothing found</div>;
  }

  const openEditModal = (index) => {
    setOpenEditModalIndex(index);
  };

  const closeEditModal = () => {
    setOpenEditModalIndex(-1);
  };

  const openDeleteModal = (index) => {
    setOpenDeleteModalIndex(index);
  };

  const closeDeleteModal = () => {
    setOpenDeleteModalIndex(-1);
  };

  const updateAccountSubType = (
    accountSubTypeId,
    updatedSubTypeName,
    updatedDescription,
    selectedAccountTypeId
  ) => {
    setTableData((prevTableData) =>
      prevTableData.map((accountSubType) =>
        accountSubType._id === accountSubTypeId
          ? {
              ...accountSubType,
              subTypeName: updatedSubTypeName,
              description: updatedDescription,
              accountTypeId: selectedAccountTypeId,
            }
          : accountSubType
      )
    );
  };

  const deleteAccountSubType = (accountSubTypeId) => {
    setTableData((prevTableData) =>
      prevTableData.filter(
        (accountType) => accountType._id !== accountSubTypeId
      )
    );
  };

  return (
    <div className="relative overflow-x-auto ">
      <h2 className="text-xl font-bold my-3">All Account Sub-Types</h2>
      {loading ? <TableLoadingSkeleton columns={4} /> : null}
      {!loading ? (
        <table className="w-full text-sm text-left text-gray-500 shadow-md ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Sub-Type Name
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Description</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Account Type</div>
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(
              (
                {
                  _id,
                  subTypeName,
                  description,
                  accountTypeId: { typeName, _id: typeId },
                },
                index
              ) => (
                <tr key={_id} className="bg-white border-b ">
                  <td className="px-6 py-4 capitalize ">{subTypeName}</td>
                  <td className="px-6 py-4">{description}</td>
                  <td className="px-6 py-4">{typeName}</td>
                  <td className="px-6 py-4 text-right flex gap-3">
                    <button
                      onClick={() => {
                        openEditModal(index);
                      }}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(index)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                  {openEditModalIndex === index && (
                    <Modal isOpen={true} onClose={closeEditModal}>
                      <EditSubTypeModal
                        accountSubTypeId={_id}
                        subTypeName={subTypeName}
                        description={description}
                        typeId={typeId}
                        closeModal={closeEditModal}
                        updateAccountSubType={updateAccountSubType}
                      />
                    </Modal>
                  )}
                  {openDeleteModalIndex === index && (
                    <Modal isOpen={true} onClose={closeDeleteModal}>
                      <DeleteSubTypeModal
                        accountSubTypeId={_id}
                        closeModal={closeDeleteModal}
                        deleteAccountType={deleteAccountSubType}
                      />
                    </Modal>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default AccountSubTypesTable;
