import React from "react";

const Profitlossreport = (props) => {
  const { reportData } = props;
  const incomeAccounts = reportData?.incomeAccounts;
  const expensesAccounts = reportData?.expensesAccounts;
  const totalIncome = reportData?.totalIncome;
  const totalExpenses = reportData?.totalExpenses;
  const netIncome = totalIncome - totalExpenses;
  const startDate = reportData?.startDate;
  const endDate = reportData?.endDate;

  const formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedEndDate = new Date(endDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Merge incomeAccounts and expensesAccounts into a single array
  const mergedAccounts = [];
  let maxCount = Math.max(
    incomeAccounts?.length || 0,
    expensesAccounts?.length || 0
  );

  for (let i = 0; i < maxCount; i++) {
    const incomeAccount = incomeAccounts?.[i];
    const expenseAccount = expensesAccounts?.[i];

    const mergedAccount = {
      expenseAccountName: expenseAccount?.accountName || "",
      expenseAmount: expenseAccount?.amount || "",
      incomeAccountName: incomeAccount?.accountName || "",
      incomeAmount: incomeAccount?.amount || "",
    };

    mergedAccounts.push(mergedAccount);
  }

  return (
    <div className="print:absolute print:top-0 print:left-0 print:w-full print:bg-white print:h-full">
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-2xl font-bold">Krishibid Institution Bangladesh</h1>
        <p className="text-gray-500">KIB Complex, Khamar Bari Rd, Dhaka 1215</p>
        <p className="text-lg font-bold">Income Expense Report</p>
        <p className="text-gray-500">
          {formattedStartDate} to {formattedEndDate}
        </p>
      </div>
      <div>
        <table className="w-full border  border-black ">
          <thead className="border border-black">
            <tr>
              <th className="py-2" style={{ width: "40%" }}>
                Expense
              </th>
              <th className="py-2 border border-black" style={{ width: "10%" }}>
                Taka
              </th>
              <th className="py-2" style={{ width: "40%" }}>
                Income
              </th>
              <th
                className="py-2 border-l border-black"
                style={{ width: "10%" }}
              >
                Taka
              </th>
            </tr>
          </thead>
          <tbody>
            {mergedAccounts.map((account, index) => (
              <tr key={index}>
                <td className="text-left px-5 border border-black">
                  {String(account.expenseAccountName)}
                </td>
                <td className="text-right px-5 border border-black">
                  {String(account.expenseAmount)}
                </td>
                <td className="text-left px-5 border border-black">
                  {String(account.incomeAccountName)}
                </td>
                <td className="text-right px-5 border border-black">
                  {String(account.incomeAmount)}
                </td>
              </tr>
            ))}

            <tr>
              <td className="text-left py-3 font-bold border border-black">
                {" "}
              </td>
              <td className="text-right py-3 font-bold border border-black">
                {" "}
              </td>
              <td className="text-left py-3 font-bold border border-black">
                {" "}
              </td>
              <td className="text-right py-3 font-bold border border-black">
                {" "}
              </td>
            </tr>
            <tr>
              <td className="text-left px-5 font-bold border border-black">
                Total Expense
              </td>
              <td className="text-right px-5 font-bold border border-black">
                {String(totalExpenses)}
              </td>
              <td className="text-left px-5 font-bold border border-black">
                Total Income
              </td>
              <td className="text-right px-5 font-bold border border-black">
                {String(totalIncome)}
              </td>
            </tr>
            <tr>
              <td className="text-left px-5 font-bold border border-black">
                Net income (Total Income - Total Expense)
              </td>
              <td className="text-right px-5 font-bold border border-black">
                {String(netIncome)}
              </td>
              <td className="text-left px-5 font-bold border border-black"></td>
              <td className="text-right px-5 font-bold border border-black"></td>
            </tr>
            <tr>
              <td className="text-left py-3 font-bold border border-black">
                {" "}
              </td>
              <td className="text-right py-3 font-bold border border-black">
                {" "}
              </td>
              <td className="text-left py-3 font-bold border border-black">
                {" "}
              </td>
              <td className="text-right py-3 font-bold border border-black">
                {" "}
              </td>
            </tr>
            <tr>
              <td className="text-left px-5 font-bold border border-black">
                Total
              </td>
              <td className="text-right px-5 font-bold border border-black">
                {String(netIncome + totalExpenses)}
              </td>
              <td className="text-left px-5 font-bold border border-black">
                Total
              </td>
              <td className="text-right px-5 font-bold border border-black">
                {String(totalIncome)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profitlossreport;
