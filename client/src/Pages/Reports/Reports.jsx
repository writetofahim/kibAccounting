import React from "react";
import { Link } from "react-router-dom";

const Reports = () => {
  const reports = [
    {
      id: 1,
      name: "Journal Report",
      link: "/journal-entries",
      description: `Financial report that provides a summary of all the transactions`,
    },
    {
      id: 2,
      name: "Ledger Report",
      link: "/reports/ledger",
      description: `Summary of all the transactions recorded in a ledger for a specific period`,
    },
    {
      id: 3,
      name: "Income Expanse Report",
      link: "/reports/income-expense",
      description: `Financial statement that shows a company's revenues and expenses`,
    },
    {
      id: 4,
      name: "Profit/Loss Report",
      link: "/reports/income-expense",
      description: `The report summarizes the company's financial performance`,
    },
    {
      id: 5,
      name: "Account Received and Paid Report",
      link: "/reports/received-paid",
      description: `Summarizes the transactions to accounts receivable and accounts payable`,
    },
  ];
  return (
    <div className="p-3 h-screen-3/4 overflow-y-auto mx-3">
      <h1 className="text-3xl font-semibold mb-6 text-black">Reports</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg p-6 text-black flex flex-col justify-between shadow-md transition-transform duration-200 ease-in-out hover:scale-105 transform-gpu "
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">{report.name}</h3>
              <p className="text-lg mb-4">{report.description}</p>
            </div>
            <Link
              to={report.link}
              className="bg-primary-300 text-white py-2 px-4 rounded-md text-center"
            >
              View Report
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
