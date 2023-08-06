import React, { useContext, useEffect, useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import Select from "react-select";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "../../utils/axiosInstance";
import Modal from "../Modal/Modal";
import Tooltip from "../Tooltip/Tooltip";

const Transactions = () => {
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [transactionType, setTransactionType] = useState("Transfer");
  const [paymentType, setPaymentType] = useState("Bank");
  const [key, setKey] = useState(Date.now());

  const [rows, setRows] = useState([
    { id: 1, accountId: "", debitAmount: "", creditAmount: "" },
    { id: 2, accountId: "", debitAmount: "", creditAmount: "" },
  ]);

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isCancel, setIsCancel] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    axios
      .get("/accounts", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setAccounts(res.data.accounts))
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows[prevRows.length - 1]?.id + 1 || 1,
        accountId: "",
        debitAmount: "",
        creditAmount: "",
      },
    ]);
  };

  const removeRow = (id) => {
    setRows((prevRows) => prevRows.filter((r) => r.id !== id));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Calculate the total debit and credit amounts
    const totalDebit = rows.reduce(
      (sum, row) => sum + parseFloat(row.debitAmount || 0),
      0
    );
    const totalCredit = rows.reduce(
      (sum, row) => sum + parseFloat(row.creditAmount || 0),
      0
    );

    const hasNoAccountId = rows.findIndex((row) => row.accountId === "");

    if (hasNoAccountId !== -1) {
      toast.error("Please select account ");
      return;
    }

    if (Number(totalDebit) <= 0 || Number(totalCredit) <= 0) {
      toast.error("Debit and credit amounts can not be empty.");
      return;
    }

    if (totalDebit !== totalCredit) {
      // Display an error or handle the case when debit and credit amounts are not equal
      toast.error("Debit and credit amounts must be equal.");
      return;
    }

    const mappedDebitAccounts = rows
      .map((row) => {
        if (row.debitAmount) {
          return {
            accountId: row.accountId,
            amount: parseFloat(row.debitAmount),
          };
        }
        return null;
      })
      .filter((account) => account !== null);

    const mappedCreditAccounts = rows
      .map((row) => {
        if (row.creditAmount) {
          return {
            accountId: row.accountId,
            amount: parseFloat(row.creditAmount),
          };
        }
        return null;
      })
      .filter((account) => account !== null);

    const transactionData = {
      description,
      debitAccounts: mappedDebitAccounts,
      creditAccounts: mappedCreditAccounts,
      createdBy: user._id,
      isPosted: false,
      notes,
      transactionType,
      paymentType,
    };

    setLoading(true);
    const token = JSON.parse(localStorage.getItem("accessToken"));
    axios
      .post("/transactions", transactionData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          toast.success("Transactions saved successfully");
          // Reset the form after successful submission
          resetFields();
        }
      })
      .catch((err) => {
        toast.error("Failed to save transaction");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetFields = () => {
    setDescription("");
    setNotes("");
    setTransactionType("Transfer");
    setPaymentType("Bank");
    setRows([
      { id: 1, accountId: "", debitAmount: "", creditAmount: "" },
      { id: 2, accountId: "", debitAmount: "", creditAmount: "" },
    ]);
    setKey(Date.now());
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold my-5">
        Add New Transaction
      </h1>
      <form onSubmit={handleFormSubmit}>
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th className="py-2">Account</th>
              <th className="py-2">Debit</th>
              <th className="py-2">Credit</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <React.Fragment key={index}>
                <tr>
                  <Dropdown
                    key={key}
                    row={row}
                    setRows={setRows}
                    accounts={accounts}
                  />
                  <td>
                    {rows.length > 2 && index === rows.length - 1 ? (
                      <Tooltip text={"Close The row"}>
                        <button
                          type="button"
                          className="py-2 px-4 bg-red-500 text-white rounded ml-1"
                          onClick={() => removeRow(row.id)}
                        >
                          -
                        </button>
                      </Tooltip>
                    ) : null}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <Tooltip text={"Add a new Row"}>
          <button
            type="button"
            className="py-2 px-4 bg-primary-400 text-white rounded cursor-pointer"
            onClick={addRow}
          >
            +
          </button>
        </Tooltip>
        <h2 className="mt-4 flex items-center gap-2">
          <span>
            Description<span className="text-red-500">*</span>
          </span>
          <Tooltip text={"Note or Description about the Transaction"}>
            <BsQuestionCircle />
          </Tooltip>
        </h2>
        <textarea
          className="w-full h-24 mt-2 p-2 border border-gray-300 rounded"
          value={description}
          placeholder="Short description of the Transaction"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {/* <h2 className="mt-4">Note</h2>
        <textarea
          className="w-full h-24 mt-2 p-2 border border-gray-300 rounded"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        /> */}
        <h2 className="mt-4 hidden">Transaction Type</h2>{" "}
        {/*Currently in Hidden*/}
        <select
          className="w-full p-2 border border-gray-300 rounded mt-2 hidden"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="Transfer">Transfer</option>
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
        </select>
        <h2 className="mt-4 hidden">Payment Type</h2> {/*Currently in Hidden*/}
        <select
          className="w-full p-2 border border-gray-300 rounded mt-2 hidden"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="Bank">Bank</option>
          <option value="Cash">Cash</option>
        </select>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-3 items-center">
          <button
            disabled={loading}
            className={`py-2 px-4 mt-4 bg-primary-400 text-white rounded disabled:bg-blue-400 flex gap-2 items-center`}
          >
            Add Transaction
            {loading && <CgSpinner className="animate-spin text-2xl" />}
          </button>
          <button
            disabled={loading}
            onClick={() => setIsCancel((p) => !p)}
            type="button"
            className={`py-2 px-4 mt-4 bg-red-500 text-white rounded disabled:bg-red-400 flex gap-2 items-center`}
          >
            Cancel
          </button>
          <Modal isOpen={isCancel} onClose={() => setIsCancel((p) => !p)}>
            <ResetConfirmModal
              handleConfirm={resetFields}
              closeModal={() => setIsCancel((p) => !p)}
            />
          </Modal>
        </div>
      </form>
    </div>
  );
};

const Dropdown = ({ row, setRows, accounts }) => {
  const { id, accountId, debitAmount, creditAmount } = row || {};

  const accountsArray = accounts.map((account) => {
    return { value: account._id, label: account.accountName };
  });

  const [selectedAccount, setSelectedAccount] = useState({
    value: "Select *",
    label: "Select *",
  });

  const handleDebitAmountChange = (e) => {
    setRows((prevRows) =>
      prevRows.map((r) => {
        if (r.id === id) {
          return { ...r, debitAmount: e.target.value, creditAmount: "" };
        }
        return r;
      })
    );
  };

  const handleCreditAmountChange = (e) => {
    setRows((prevRows) =>
      prevRows.map((r) => {
        if (r.id === id) {
          return { ...r, creditAmount: e.target.value, debitAmount: "" };
        }
        return r;
      })
    );
  };

  const handleSelectChange = (option) => {
    setSelectedAccount(option);
    setRows((prevRows) =>
      prevRows.map((r) => {
        if (r.id === id) {
          return { ...r, accountId: option.value };
        }
        return r;
      })
    );
  };

  return (
    <>
      <td>
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={selectedAccount}
          onChange={handleSelectChange}
          options={accountsArray}
        />
      </td>
      <td>
        <input
          type="number"
          disabled={(accountId === "" && true) || (creditAmount > 0 && true)}
          className="w-full p-2 border border-gray-300 rounded"
          value={debitAmount}
          onChange={handleDebitAmountChange}
        />
      </td>
      <td>
        <input
          type="number"
          disabled={(accountId === "" && true) || (debitAmount > 0 && true)}
          className="w-full p-2 border border-gray-300 rounded"
          value={creditAmount}
          onChange={handleCreditAmountChange}
        />
      </td>
    </>
  );
};

export default Transactions;

const ResetConfirmModal = ({ handleConfirm, closeModal }) => {
  const handleConfirmReset = () => {
    handleConfirm();
    closeModal();
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Reset Transaction Fields</h2>
      <p className="mb-4">Are you sure you want to reset transaction fields?</p>

      <div className="flex justify-end">
        <button
          onClick={handleConfirmReset}
          className="px-4 py-2 mr-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
        <button
          onClick={closeModal}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
