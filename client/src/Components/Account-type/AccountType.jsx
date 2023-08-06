import React, { useState } from "react";
import AccountTypesTable from "../AccountTypeTable/AccountTypeTable";
import EditAccountTypeModal from "../AccountTypeTable/EditAccountTypeModal";
import Modal from "../Modal/Modal";

const AccountType = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

  const updateAccountType = (accountTypeId, typeName, description) => {
    setTableData((prevTableData) => [
      ...prevTableData,
      { _id: accountTypeId, typeName, description },
    ]);
  };

  return (
    <div className="p-5">
      <div className="flex justify-end ">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-300 text-white px-2 py-1 rounded-sm"
        >
          Add Account Type
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen((p) => !p)}>
        <EditAccountTypeModal
          updateAccountType={updateAccountType}
          closeModal={() => setIsModalOpen((p) => !p)}
        />
      </Modal>
      <div>
        <AccountTypesTable tableData={tableData} setTableData={setTableData} />
      </div>
    </div>
  );
};

export default AccountType;
