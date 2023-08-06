import React, { useEffect, useState } from "react";
import { BsFillPrinterFill } from "react-icons/bs";
import Select from "react-select";
import Loading from "../../Components/Loading/Loading";
import axios from "../../utils/axiosInstance";

const LedgerReport = () => {
  const [accounts, setAccounts] = useState([]);
  const [reportData, setReportData] = useState({});
  const [startDate, setStartDate] = useState(
    new Date().getFullYear() + "-01-01"
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedAccount, setSelectedAccount] = useState({});

  const [loading, setLoading] = useState(true);

  // Get All Accounts
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    axios
      .get("/accounts", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setAccounts(res.data.accounts);
        setSelectedAccount({
          _id: res.data.accounts[0]?._id,
          value: res.data.accounts[0]?._id,
          label: res.data.accounts[0]?.accountName,
        });
      })
      .catch((e) => {
        console.error(e.message);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const accessToken = JSON.parse(token);
    const getTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get("reports/ledger", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            accountId: selectedAccount._id,
            startDate: startDate,
            endDate: endDate,
          },
        });
        setReportData(response.data.reportData);
      } catch (error) {
        console.error("Error fetching Income-Loss Report:", error);
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, [startDate, endDate, selectedAccount._id]);

  const formatCurrency = (amount) => {
    return amount.toFixed(2);
  };

  const getTotalDebit = () => {
    if (reportData?.debitEntries) {
      return reportData.debitEntries.reduce(
        (total, entry) => total + entry.entryAmount,
        0
      );
    }
    return 0;
  };

  const getTotalCredit = () => {
    if (reportData?.creditEntries) {
      return reportData.creditEntries.reduce(
        (total, entry) => total + entry.entryAmount,
        0
      );
    }
    return 0;
  };

  const getTotalBalance = () => {
    const totalDebit = getTotalDebit();
    const totalCredit = getTotalCredit();
    return totalDebit + totalCredit;
  };

  const handleSelectChange = (option) => {
    setSelectedAccount(option);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Ledger Report</h1>
      <div className="flex gap-5 mb-4 flex-wrap">
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
      {reportData?.account && (
        <div className="mb-4">
          <div className="md:w-44 w-full">
            <label className="mr-2">Select Account:</label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={selectedAccount}
              onChange={handleSelectChange}
              options={accounts.map((a) => ({
                value: a._id,
                label: a.accountName,
                _id: a._id,
              }))}
            />
          </div>
          <h2 className="text-lg font-semibold">
            Account: {reportData.account.accountName}
          </h2>
          <p>Account Description: {reportData.account.description}</p>
          <p>
            Opening Balance: {formatCurrency(reportData.account.openingBalance)}
          </p>
          <p>
            Current Balance: {formatCurrency(reportData.account.currentBalance)}
          </p>
          <p>
            Filtered Balance:{" "}
            {formatCurrency(
              getTotalBalance() * -1 + reportData.account.openingBalance
            )}
          </p>
        </div>
      )}
      {loading && <Loading />}
      {!loading && (
        <div className="table-container mx-auto w-full md:w-2/3">
          <div className="flex justify-end">
            <button
              disabled={loading}
              onClick={handlePrint}
              className="print-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-5 px-4 rounded flex items-center gap-2"
            >
              <BsFillPrinterFill /> Print
            </button>
          </div>
          <h2 className="text-lg font-semibold">Ledger Entries:</h2>
          <div className="print:absolute print:top-0 print:left-0 print:w-full print:bg-white print:h-full">
            <div className={`text-center print:block hidden`}>
              <p className="text-lg font-bold">
                Krishibid Institution Bangladesh
              </p>
              <p className="text-md">
                Krishi Khamar road, Farmgate, Dhaka-2015
              </p>
              <p className="text-lg ">
                Ledger report of{" "}
                <span className="font-bold">
                  {reportData?.account?.accountName}
                </span>
              </p>
              <p>
                From: {startDate} To: {endDate}
              </p>
            </div>
            <table className="border-collapse border-2 border-black w-full">
              <thead>
                <tr>
                  <th className="border-2 border-black">Date</th>
                  <th className="border-2 border-black">Account</th>
                  <th className="border-2 border-black">Debit</th>
                  <th className="border-2 border-black">Credit</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.debitEntries &&
                  reportData.debitEntries?.map((entry) => (
                    <tr
                      key={entry.transactionId}
                      className="border border-black"
                    >
                      <td className="border border-black px-2">
                        {entry.transactionDate.split("T")[0]}
                      </td>
                      <td className="border border-black px-2">
                        <p>{entry.accountName}</p>
                        <p>( {entry.transactionDetails} )</p>
                      </td>
                      <td className="border border-black px-2">
                        {formatCurrency(entry.entryAmount * -1)}
                      </td>
                      <td className="border border-black px-2"></td>
                    </tr>
                  ))}
                {reportData?.creditEntries &&
                  reportData.creditEntries?.map((entry) => (
                    <tr key={entry.transactionId}>
                      <td className="border border-black px-2">
                        {entry.transactionDate.split("T")[0]}
                      </td>
                      <td className="border border-black px-2">
                        <p>{entry.accountName}</p>
                        <p>( {entry.transactionDetails} )</p>
                      </td>
                      <td className="border border-black px-2"></td>
                      <td className="border border-black px-2">
                        {formatCurrency(entry.entryAmount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="">
                <tr>
                  <td className=""></td>
                  <td className=""></td>
                  <td className="border-2 font-bold border-black px-2">
                    {formatCurrency(getTotalDebit() * -1)}
                  </td>
                  <td className="border-2 font-bold border-black px-2">
                    {formatCurrency(getTotalCredit())}
                  </td>
                </tr>
                <tr>
                  <td className=""></td>
                  <td className=""></td>
                  <td className="border-2 border-black font-bold px-2">
                    Total Balance:{" "}
                  </td>
                  <td className="font-bold border-black px-2">
                    {formatCurrency(getTotalBalance() * -1)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LedgerReport;
