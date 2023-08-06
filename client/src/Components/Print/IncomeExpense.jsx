import React, { useEffect, useState } from "react";
import Profitlossreport from "../../Components/Print/Profitlossreport";
import axios from "../../utils/axiosInstance";

const IncomeExpense = () => {
  const [reportData, setReportData] = useState({});
  const [startDate, setStartDate] = useState(
    new Date().getFullYear() + "-01-01"
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const accessToken = JSON.parse(token);
    const getTransactions = async () => {
      try {
        const response = await axios.get("reports/profit-loss", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            startDate: startDate,
            endDate: endDate,
          },
        });
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching Income-Loss Report:", error);
      }
    };

    getTransactions();
  }, [startDate, endDate]);

  const expenseSum =
    reportData?.reportData?.totalExpenses +
    (reportData?.reportData?.profitLoss > 0
      ? reportData?.reportData?.profitLoss
      : 0);
  const incomeSum =
    reportData?.reportData?.totalIncome +
    (reportData?.reportData?.profitLoss < 0
      ? reportData?.reportData?.profitLoss
      : 0);

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Profit-Loss Report</h1>
      <div className="flex justify-between mb-4">
        <div>
          <label className="mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      {reportData.reportData && (
        <>
          <div className="border border-gray-500 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Start Date:</span>
              <span>{reportData.reportData.startDate}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">End Date:</span>
              <span>{reportData.reportData.endDate}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total Income:</span>
              <span className="font-bold">
                {reportData.reportData.totalIncome}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total Expenses:</span>
              <span className="font-bold">
                {reportData.reportData.totalExpenses}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Profit/Loss:</span>
              <span className="font-bold">
                {reportData.reportData.profitLoss}
              </span>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 border border-gray-500 rounded-lg p-4 mr-2">
              <h2 className="text-lg font-bold mb-4">Expenses Accounts</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-2">Account Name</th>
                    <th className="py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.reportData.expensesAccounts.map((account) => (
                    <tr key={account.accountId}>
                      <td className="py-2">{account.accountName}</td>
                      <td className="py-2 text-center">{account.amount}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-black">
                    <td className="py-2 font-bold">Total Expenses</td>
                    <td className="py-2 font-bold text-center">
                      {reportData.reportData.totalExpenses}
                    </td>
                  </tr>
                  {reportData.reportData.profitLoss > 0 && (
                    <tr className="font-bold">
                      <td className="py-2">Net Income (Income - Expenses)</td>
                      <td className="py-2 text-center">
                        {reportData.reportData.profitLoss}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-black">
                    <th className="py-2">Total Expenses</th>
                    <th className="py-2">{expenseSum}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="w-1/2 border border-gray-500 rounded-lg p-4 ml-2">
              <h2 className="text-lg font-bold mb-4">Income Accounts</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-2">Account Name</th>
                    <th className="py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.reportData.incomeAccounts.map((account) => (
                    <tr key={account.accountId}>
                      <td className="py-2">{account.accountName}</td>
                      <td className="py-2 text-center">{account.amount}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-black">
                    <td className="py-2 font-bold">Total Income</td>
                    <td className="py-2 font-bold text-center">
                      {reportData.reportData.totalIncome}
                    </td>
                  </tr>

                  {reportData.reportData.profitLoss < 0 && (
                    <tr className="font-bold">
                      <td className="py-2">Net Loss</td>
                      <td className="py-2 text-center">
                        {Math.abs(reportData.reportData.profitLoss)}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-black">
                    <th className="py-2">Total Income</th>
                    <th className="py-2">{incomeSum}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
      <div id="print-container" className="hidden">
        <Profitlossreport reportData={reportData.reportData} />
      </div>
      <button
        onClick={handlePrint}
        className="print-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-5 px-4 rounded"
      >
        Print
      </button>
    </div>
  );
};

export default IncomeExpense;

const handlePrint = () => {
  const printContainer = document.getElementById("print-container");
  const originalContents = document.body.innerHTML;

  // Replace the page content with the component to be printed
  document.body.innerHTML = printContainer.innerHTML;

  // Trigger the print action
  window.print();

  // Restore the original page content
  document.body.innerHTML = originalContents;
  location.reload();
};
