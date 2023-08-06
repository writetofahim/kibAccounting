import React, { useState } from "react";
import AccountSubTypeTable from "../AccountSubTypeTable/AccountSubTypeTable";
import EditSubTypeModal from "../AccountSubTypeTable/EditSubTypeModal";
import Modal from "../Modal/Modal";

const AccountType = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

  const updateAccountSubType = (
    accountSubTypeId,
    updatedSubTypeName,
    updatedDescription,
    selectedAccountTypeId
  ) => {
    console.log("selectedAccountTypeId", selectedAccountTypeId);
    setTableData((prevTableData) => [
      ...prevTableData,
      {
        _id: accountSubTypeId,
        subTypeName: updatedSubTypeName,
        description: updatedDescription,
        accountTypeId: selectedAccountTypeId,
      },
    ]);
  };

  return (
    <div className="p-5">
      <div className="flex justify-end ">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-300 text-white px-2 py-1 rounded-sm"
        >
          Add Account Sub Type
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen((p) => !p)}>
        <EditSubTypeModal
          updateAccountSubType={updateAccountSubType}
          closeModal={() => setIsModalOpen((p) => !p)}
        />
      </Modal>
      <div>
        <AccountSubTypeTable
          tableData={tableData}
          setTableData={setTableData}
        />
      </div>
    </div>
  );
};

export default AccountType;
