import React, { useEffect, useState } from "react";
import { BsFillPrinterFill } from "react-icons/bs";
import ErrorMessage from "../../Components/ErrorMessage/ErrorMessage";
import Loading from "../../Components/Loading/Loading";
import Profitlossreport from "../../Components/Print/Profitlossreport";
import axios from "../../utils/axiosInstance";

const IncomeExpense = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

    const fetchReportData = async () => {
      try {
        setLoading(true);

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Income-Loss Report:", error);
        setError("Failed to fetch Income-Loss Report");
        setLoading(false);
      }
    };

    fetchReportData();
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

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex justify-between gap-5 items-center">
        <h1 className="text-2xl font-bold mb-4">Income Expense Report</h1>
        <button
          onClick={handlePrint}
          className="print-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-5 px-4 rounded flex items-center gap-2"
        >
          <BsFillPrinterFill /> Print
        </button>
      </div>
      <div className="flex gap-5 mb-4">
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
      {!loading && reportData.reportData && (
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
              <span
                className={`font-bold ${
                  reportData.reportData.profitLoss > 0
                    ? "text-green-500"
                    : `text-red-400`
                }`}
              >
                {reportData.reportData.profitLoss > 0
                  ? reportData.reportData.profitLoss
                  : reportData.reportData.profitLoss * -1}
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
                      <td className="py-2">Net Profit (Income - Expenses)</td>
                      <td className="py-2 text-center text-green-500">
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
                      <td className="py-2 text-center text-red-500">
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
      <div id="print-container" className="print:block hidden">
        <Profitlossreport reportData={reportData.reportData} />
      </div>
    </div>
  );
};

export default IncomeExpense;

const handlePrint = () => {
  window.print();
};
