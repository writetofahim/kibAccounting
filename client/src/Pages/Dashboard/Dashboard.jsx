import React, { useEffect, useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import Tooltip from "../../Components/Tooltip/Tooltip";
import axios from "../../utils/axiosInstance";

const Dashboard = () => {
  const [reportData, setReportData] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error("Error fetching Income-Loss Report:", error);
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, [startDate, endDate]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const accessToken = JSON.parse(token);
    axios
      .get(`/accounts?accountType=assets`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setAccounts(res.data.accounts))
      .catch((err) => {
        console.log(err);
        setError(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, []);

  // console.log(accounts);

  const totalRevenue = reportData?.reportData?.totalIncome;
  const totalExpenses = reportData?.reportData?.totalExpenses;
  const profitLoss = reportData?.reportData?.profitLoss;

  return (
    <div className="">
      <main className="py-8">
        <div className=" mx-auto px-6">
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

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...new Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-full mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Total Revenue
                  </h2>
                  <Tooltip text={`Total revenue of KIB (sum of total incomes)`}>
                    <div className="p-2">
                      <BsQuestionCircle />
                    </div>
                  </Tooltip>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {" "}
                  ৳ {totalRevenue}
                </p>
              </div>
              {/* Total Expenses */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-full mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Total Expenses
                  </h2>
                  <Tooltip
                    text={`Total expenses of KIB (sum of total expenses)`}
                  >
                    <div className="p-2">
                      <BsQuestionCircle />
                    </div>
                  </Tooltip>
                </div>
                <p className="text-3xl font-bold text-red-600">
                  {" "}
                  ৳ {totalExpenses}
                </p>
              </div>
              {/* Net Income */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-full mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {profitLoss > 0 ? "Net Profit" : "Net Loss"}
                  </h2>
                  <Tooltip
                    text={`${
                      profitLoss > 0 ? "Net profit" : "Net loss"
                    } of KIB (total revenue - total expenses)`}
                  >
                    <div className="p-2">
                      <BsQuestionCircle />
                    </div>
                  </Tooltip>
                </div>
                <p
                  className={`text-3xl font-bold ${
                    profitLoss > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {" "}
                  ৳ {profitLoss > 0 ? profitLoss : profitLoss * -1}
                </p>
              </div>
            </div>
          )}
          <h1 className="my-5 font-bold text-2xl">Accounts Current Balance</h1>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...new Array(7)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
              {/* Accounts*/}
              {accounts?.map((acc) => (
                <div
                  key={acc._id}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-full mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {acc.accountName}
                    </h2>
                    <Tooltip text={`Current balance of ${acc.accountName}`}>
                      <div className="p-2">
                        <BsQuestionCircle />
                      </div>
                    </Tooltip>
                  </div>

                  <p className="text-3xl font-bold text-blue-600">
                    {" "}
                    ৳ {acc.currentBalance}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

const SkeletonCard = () => {
  return (
    <div className="animate-pulse ">
      <div className="rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow bg-white">
        <span className="text-xl font-semibold mb-4 bg-slate-200 h-5 rounded w-40 block"></span>
        <span className="text-xl font-semibold mb-4 bg-slate-200 h-7 rounded w-32 block"></span>
      </div>
    </div>
  );
};
