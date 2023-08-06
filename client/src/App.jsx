import { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountType from "./Components/Account-type/AccountType";
import AccountSubtype from "./Components/AccountSubtype/AccountSubtype";
import Login from "./Components/Login/Login";
import Transactions from "./Components/Transactions/Transactions";
import { AuthContext } from "./contexts/AuthContext";
import Main from "./Layout/Main";
import ChartOfAccounts from "./Pages/ChartOfAccounts/ChartOfAccounts";
import Dashboard from "./Pages/Dashboard/Dashboard";
import JournalEntries from "./Pages/JournalEntries/JournalEntries";
import IncomeExpense from "./Pages/Reports/IncomeExpense";
import LedgerReport from "./Pages/Reports/LedgerReport";
import ReceivedAndPaidReport from "./Pages/Reports/ReceivedAndPaidReport";
import Reports from "./Pages/Reports/Reports";
import UserGuide from "./Pages/UserGuide/UserGuide";
import UserManagement from "./Pages/UserManagement/UserManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      // { path: "/", element: <Home /> },
      { path: "/", element: <Dashboard /> },
      { path: "/chart-of-accounts", element: <ChartOfAccounts /> },
      { path: "/chart-of-accounts/account-type", element: <AccountType /> },
      {
        path: "/chart-of-accounts/account-sub-type",
        element: <AccountSubtype />,
      },
      { path: "/transactions", element: <Transactions /> },
      { path: "/journal-entries", element: <JournalEntries /> },
      { path: "/reports", element: <Reports /> },
      { path: "/reports/income-expense", element: <IncomeExpense /> },
      { path: "/reports/received-paid", element: <ReceivedAndPaidReport /> },
      { path: "/reports/ledger", element: <LedgerReport /> },
      { path: "/user-management", element: <UserManagement /> },
      { path: "/user-guide", element: <UserGuide /> },
      // { path: "/documentation", element: <Documentation /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  const { user, loading } = useContext(AuthContext);
  // if (!user && loading)
  //   return (
  //     <div className="flex items-center justify-center h-screen w-screen">
  //       <CgSpinner className="animate-spin text-4xl" />
  //     </div>
  //   );
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
      <div id="modal-root"></div>
    </div>
  );
}

export default App;
