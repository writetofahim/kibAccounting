import React, { useEffect, useState } from "react";
import { BsFillPrinterFill } from "react-icons/bs";
import ErrorMessage from "../../Components/ErrorMessage/ErrorMessage";
import Loading from "../../Components/Loading/Loading";
import axios from "../../utils/axiosInstance";

const ReceivedAndPaidReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingBalance, setOpeningBalance] = useState({});
  const [closingBalance, setClosingBalance] = useState({});
  const [receivedAndPaid, setReceivedAndPaid] = useState({});
  const [startDate, setStartDate] = useState(
    new Date().getFullYear() + "-01-01"
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const accessToken = JSON.parse(token);

    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          openingBalanceResponse,
          receivedAndPaidResponse,
          closingBalanceResponse,
        ] = await Promise.all([
          axios.get("/reports/arap/assets", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              startDate: startDate,
              endDate: endDate,
            },
          }),
          axios.get("/reports/arap/received", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              startDate: startDate,
              endDate: endDate,
            },
          }),
          axios.get("/reports/arap/closingAsset", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              startDate: startDate,
              endDate: endDate,
            },
          }),
        ]);

        setOpeningBalance(openingBalanceResponse.data.reportData);
        setReceivedAndPaid(receivedAndPaidResponse.data.reportData);
        setClosingBalance(closingBalanceResponse.data.reportData);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const receivedAccounts = receivedAndPaid.kibReceivedAndPaid?.filter(
    (f) => f.categoryType === "received"
  );
  const paidAccounts = receivedAndPaid.kibReceivedAndPaid?.filter(
    (f) => f.categoryType === "paid"
  );

  let totalOpeningBalance = openingBalance?.accountArray?.reduce(
    (prev, current) => prev + current.amount,
    0
  );

  let totalClosingBalance = closingBalance?.accountArray?.reduce(
    (prev, current) => prev + current.amount,
    0
  );

  let totalReceivedBalance = 0;
  let totalPaidBalance = 0;

  const totalR = receivedAndPaid.kibReceivedAndPaid
    ?.filter((f) => f.categoryType === "received")
    .reduce((prev, current) => prev + current.categoryTotal, 0);

  const totalP = receivedAndPaid.kibReceivedAndPaid
    ?.filter((f) => f.categoryType === "paid")
    .reduce((prev, current) => prev + current.categoryTotal, 0);

  totalReceivedBalance = totalReceivedBalance + totalOpeningBalance + totalR;
  totalPaidBalance = totalPaidBalance + totalP + totalClosingBalance;

  // Inside your component
  const handlePrint = () => {
    // Add a print-specific class to the body element
    document.body.classList.add("print-mode");

    // Trigger the print functionality
    window.print();

    // Remove the print-specific class from the body element after printing
    document.body.classList.remove("print-mode");
  };

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

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="container mx-auto px-4 pt-4 ">
      <div className="flex justify-between gap-5 items-center print:hidden">
        <h1 className="text-2xl font-bold mb-4">Received and Paid Report</h1>
        <button
          disabled={loading}
          onClick={handlePrint}
          className="print-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-5 px-4 rounded flex items-center gap-2"
        >
          <BsFillPrinterFill /> Print
        </button>
      </div>
      <div className="flex gap-5 mb-4 print:hidden">
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

      {/* report table */}
      <div
        className="print:absolute print:top-0 print:left-0 print:w-full print:bg-white print:h-full"
        id="reportTable"
      >
        <div className="print:block hidden">
          <div className="flex justify-center items-center flex-col">
            <h1 className="text-2xl font-bold">
              Krishibid Institution Bangladesh
            </h1>
            <p className="text-gray-500">
              KIB Complex, Khamar Bari Rd, Dhaka 1215
            </p>
            <p className="text-lg font-bold">Received and Payment Report</p>
            <p className="text-gray-500">
              {formattedStartDate} to {formattedEndDate}
            </p>
          </div>
        </div>
        <div className="border border-gray-500 rounded-lg px-2 mb-4 print:hidden">
          <div className="flex gap-2 items-center mb-2 ">
            <span className="font-semibold">Start Date:</span>
            <span>{startDate}</span>
          </div>
          <div className="flex gap-2 items-center mb-2">
            <span className="font-semibold">End Date:</span>
            <span>{endDate}</span>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <table className="table-auto w-full border border-black">
                <thead>
                  <tr className="font-bold border border-black px-2">
                    <th>Received</th>
                    <th className="border-l border-black">Tk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-bold px-2">Opening Balance :</td>
                    <td className="px-2 border-l border-black"></td>
                  </tr>
                  {openingBalance?.accountArray?.map((acc) => (
                    <tr key={acc.accountName}>
                      <td className="px-2">{acc.accountName}</td>
                      <td className="px-2 border-l border-black">
                        {acc.amount}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-2 border border-black"></td>
                    <td className="font-bold px-2 border border-black">
                      {totalOpeningBalance}
                    </td>
                  </tr>

                  {receivedAndPaid?.kibReceivedAndPaid
                    ?.filter((f) => f.categoryType === "received")
                    .map((acc) => (
                      <React.Fragment key={acc.categoryName}>
                        <tr>
                          <td className="font-bold px-2">
                            {acc.categoryName} :
                          </td>
                          <td className="border-l border-black px-2"></td>
                        </tr>
                        {acc.categoryAccountsArray.map((a) => (
                          <tr key={a.accountName}>
                            <td className=" px-2">{a.accountName}</td>
                            <td className="border-l border-black px-2">
                              {a.amount}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="border border-black px-2"></td>
                          <td className="font-bold border border-black px-2">
                            {String(acc.categoryTotal)}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  <tr className="border border-black">
                    <td className="font-bold px-2">Total</td>
                    <td className="font-bold px-2 border-l border-black">
                      {totalReceivedBalance}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="table-auto w-full border border-black">
                <thead>
                  <tr className="font-bold border border-black px-2">
                    <th>Payment</th>
                    <th className="border-l border-black">Tk</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedAndPaid?.kibReceivedAndPaid
                    ?.filter((f) => f.categoryType === "paid")
                    .map((acc) => (
                      <React.Fragment key={acc.categoryName}>
                        <tr>
                          <td className="font-bold px-2">
                            {acc.categoryName} :
                          </td>
                          <td className="border-l border-black px-2"></td>
                        </tr>
                        {acc.categoryAccountsArray.map((a) => (
                          <tr key={a.accountName}>
                            <td className=" px-2">{a.accountName}</td>
                            <td className="border-l border-black px-2">
                              {a.amount}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="border border-black px-2"></td>
                          <td className="font-bold border border-black px-2">
                            {acc.categoryTotal}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  <tr>
                    <td className="font-bold px-2">Closing Balance :</td>
                    <td className="border-l border-black px-2"></td>
                  </tr>
                  {closingBalance?.accountArray?.map((acc) => (
                    <tr key={acc.accountName}>
                      <td className="px-2">{acc.accountName}</td>
                      <td className="border-l border-black px-2">
                        {acc.amount}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border border-black px-2"></td>
                    <td className="font-bold border border-black px-2">
                      {totalClosingBalance}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className="font-bold px-2">Total</td>
                    <td className="font-bold px-2 border-l border-black">
                      {totalPaidBalance}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="md:w-3/5 print:w-3/5 w-full mt-5">
              <table className="table-auto w-full">
                <tbody>
                  {receivedAccounts?.map((acc) => (
                    <tr
                      key={acc.categoryName}
                      className="border-b border-black"
                    >
                      <td className="py-2 px-4">{acc.categoryName}</td>
                      <td className="py-2 px-4">{acc.categoryTotal}</td>
                    </tr>
                  ))}
                  <tr className="">
                    <td className="py-2 px-4 font-bold">Total Received:</td>
                    <td className="py-2 px-4 font-bold underline">
                      {receivedAccounts?.reduce(
                        (prev, curr) => prev + curr.categoryTotal,
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="table-auto w-full mt-5">
                <tbody>
                  {paidAccounts?.map((acc) => (
                    <tr
                      key={acc.categoryName}
                      className="border-b border-black"
                    >
                      <td className="py-2 px-4">{acc.categoryName}</td>
                      <td className="py-2 px-4">{acc.categoryTotal}</td>
                    </tr>
                  ))}
                  <tr className="">
                    <td className="py-2 px-4 font-bold">Total Payment:</td>
                    <td className="py-2 px-4 font-bold underline">
                      {paidAccounts?.reduce(
                        (prev, curr) => prev + curr.categoryTotal,
                        0
                      )}
                    </td>
                  </tr>
                  <tr className="">
                    <td className="py-2 px-4 font-bold">
                      Total quoted for the month :
                    </td>
                    <td className="py-2 px-4 font-bold underline ">
                      {totalR - totalP}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>{" "}
          </>
        )}
      </div>
    </div>
  );
};

export default ReceivedAndPaidReport;
