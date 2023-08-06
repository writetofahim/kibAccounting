import React, { useEffect, useState } from "react";
import { BsFillPrinterFill } from "react-icons/bs";
import Loading from "../../Components/Loading/Loading";
import Tooltip from "../../Components/Tooltip/Tooltip";
import axios from "../../utils/axiosInstance";

const JournalEntries = () => {
  const [transactions, setTransactions] = useState({});
  // const [startDate, setStartDate] = useState(
  //   new Date().getFullYear() + "-01-01"
  // );
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const accessToken = JSON.parse(token);
    const getTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/transactions", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            startDate: startDate,
            endDate: endDate,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching Income-Loss Report:", error);
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, [startDate, endDate]);

  // Calculate the total debit and credit amounts
  const calculateTotalAmount = (accounts) => {
    return accounts?.reduce((total, account) => total + account.amount, 0);
  };

  // Format the date to display only the date portion
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Journal Entries</h1>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
      {loading && <Loading />}
      {!loading && (
        <div className="table-container mx-auto w-full md:w-2/3">
          <div className="flex justify-between gap-5 items-center">
            <h2 className="text-xl font-bold mt-5">Journal Entries:</h2>
            <div className=""></div>
          </div>
          <div className="print:absolute print:top-0 print:left-0 print:w-full print:bg-white print:h-full print-table">
            <div className={`text-center hidden print:block`}>
              <p className="text-lg font-bold">
                Krishibid Institution Bangladesh
              </p>
              <p className="text-md">
                Krishi Khamar road, Farmgate, Dhaka-2015
              </p>
              <p className="text-md">Journal Report</p>
              <p className="text-lg font-bold">
                {transactions?.account?.accountName}
              </p>
              <p>
                From: {startDate} To: {endDate}
              </p>
            </div>

            {/* Table Div */}
            <div className="relative">
              <div className="absolute right-0 top-[-70px] print-button">
                <Tooltip text={"Print Journal Report"}>
                  <button
                    // disabled={loading}
                    onClick={handlePrint}
                    className="print:hidden  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mt-2 px-4 rounded flex items-center gap-2"
                  >
                    <BsFillPrinterFill /> Print
                  </button>
                </Tooltip>
              </div>
              <table className="w-full max-w-4xl table-auto border border-gray-800 relative print:absolute print:top-5 print:left-0 print:w-full print:bg-white print:h-auto ">
                <thead>
                  <tr>
                    <th className="border border-gray-800 px-4 py-2">Date</th>
                    <th className="border border-gray-800 px-4 py-2">
                      Accounts &amp; Description
                    </th>
                    <th className="border border-gray-800 px-4 py-2">Debit</th>
                    <th className="border border-gray-800 px-4 py-2">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.transactions?.map((entry) => (
                    <tr key={entry._id}>
                      <td className="border border-gray-800 px-4 py-1">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="border border-gray-800 px-4 py-1">
                        <ul>
                          {entry.debitAccounts?.map((account) => (
                            <li key={account._id}>
                              {account.accountId.accountName}{" "}
                              <span className="text-sm">(Dr)</span>
                            </li>
                          ))}
                          {entry.creditAccounts?.map((account) => (
                            <li key={account._id}>
                              {account.accountId.accountName}{" "}
                              <span className="text-sm">(Cr)</span>
                            </li>
                          ))}
                          <li className="text-gray-500">
                            [ {entry.description} ]
                          </li>
                        </ul>
                      </td>
                      <td className="border border-gray-800 px-4 py-2 align-top">
                        <ul>
                          {entry.debitAccounts?.map((account) => (
                            <li key={account._id}>{account.amount}</li>
                          ))}
                          {entry.creditAccounts?.map((account) => (
                            <li key={account._id}>-</li>
                          ))}
                        </ul>
                      </td>
                      <td className="border border-gray-800 px-4 py-2 align-top">
                        <ul>
                          {entry.debitAccounts?.map((account) => (
                            <li key={account._id}>-</li>
                          ))}
                          {entry.creditAccounts?.map((account) => (
                            <li key={account._id}>{account.amount}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr>
                    <td className="border border-gray-800 px-4 py-2"></td>
                    <td className="border border-gray-800 px-4 py-2 font-bold">
                      Total
                    </td>
                    <td className="border border-gray-800 px-4 py-2 font-bold">
                      {calculateTotalAmount(
                        transactions?.transactions?.flatMap(
                          (entry) => entry.debitAccounts
                        )
                      )}
                    </td>
                    <td className="border border-gray-800 px-4 py-2 font-bold">
                      {calculateTotalAmount(
                        transactions?.transactions?.flatMap(
                          (entry) => entry.creditAccounts
                        )
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntries;
