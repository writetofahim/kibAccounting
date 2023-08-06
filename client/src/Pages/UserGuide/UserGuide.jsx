import React, { useState } from "react";
import Dashboard_01 from "../../assets/image/Dashboard_01.png";
import Dashboard_02 from "../../assets/image/Dashboard_02.png";
import Dashboard_03 from "../../assets/image/Dashboard_03.png";
import Dashboard_04 from "../../assets/image/Dashboard_04.png";
import chart_of_accounts_01 from "../../assets/image/chart_of_accounts_01.png";
import chart_of_accounts_02 from "../../assets/image/chart_of_accounts_02.png";
import chart_of_accounts_03 from "../../assets/image/chart_of_accounts_03.png";
import chart_of_accounts_04 from "../../assets/image/chart_of_accounts_04.png";
import chart_of_accounts_05 from "../../assets/image/chart_of_accounts_05.png";
import chart_of_accounts_06 from "../../assets/image/chart_of_accounts_06.png";
import chart_of_accounts_07 from "../../assets/image/chart_of_accounts_07.png";
import chart_of_accounts_08 from "../../assets/image/chart_of_accounts_08.png";
import Transaction_01 from "../../assets/image/Transaction_01.png";
import Transaction_02 from "../../assets/image/Transaction_02.png";
import report_01 from "../../assets/image/report_01.png";
import report_02 from "../../assets/image/report_02.png";
import report_03 from "../../assets/image/report_03.png";
import report_04 from "../../assets/image/report_04.png";
import report_05 from "../../assets/image/report_05.png";
import report_06 from "../../assets/image/report_06.png";
import userManagement_01 from "../../assets/image/userManagement_01.png";
import userManagement_02 from "../../assets/image/userManagement_02.png";
import userManagement_04 from "../../assets/image/userManagement_04.png";



const UserGuide = () => {

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredContent = (content) => {
    if (!searchTerm) {
      return true;
    }

    const keywords = searchTerm.toLowerCase().split(" ");
    for (let keyword of keywords) {
      if (content.toLowerCase().includes(keyword)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded p-2"
        />
      </div>
      {filteredContent("Dashboard") && (
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Dashboard</h2>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Introduction:</p>
            <p className="mb-4">
              The Dashboard is the central hub of the accounting software,
              providing an overview of important financial information. This page
              will guide you through the various components and features of the
              Dashboard.
            </p>
            <div className="flex justify-center p-5">
              <img src={Dashboard_01} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Date-wise Summary:</p>
            <p className="mb-4">
              The Dashboard displays the total revenue, total expenses, and net
              profit for each date. This allows you to analyze your financial
              performance on a daily basis. The information is presented in a
              clear and concise manner, enabling you to make informed decisions.
            </p>
            <div className="flex justify-center p-5">
              <img src={Dashboard_02} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Accounts Balance:</p>
            <p className="mb-4">
              The Dashboard also shows the current balance of your accounts. This
              balance represents the total value of all your assets. By regularly monitoring this information, you can keep
              track of your financial position.
            </p>
            <div className="flex justify-center p-5">
              <img src={Dashboard_03} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div>
            <p className="font-bold py-2 text-lg">Navigation:</p>
            <p className="mb-4">
              At the left of the Dashboard, you'll find a navigation bar that
              allows you to access different sections of the software. These
              sections include Chart of Accounts, Transactions, Journal Entries, Reports, User Management, User Guide and Documentation. Click on the respective menus to explore each section.
            </p>
            <div className="flex justify-center p-5">
              <img src={Dashboard_04} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
        </div>
      )}
      {filteredContent("Chart of Accounts") && (
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center  py-5">Chart of Accounts</h2>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Introduction:</p>
            <p className="mb-4">
              The Chart of Accounts is a crucial component of the accounting software as it organizes your financial information into different categories. This page will explain how to manage your accounts effectively.
            </p>
            <div className="flex justify-center p-5">
              <img src={chart_of_accounts_01} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Account Dropdown:</p>
            <p className="mb-4">
              The Chart of Accounts provides a dropdown menu that contains various categories, including assets, income, expenses, liabilities, and equity. Selecting a specific account category will display the associated accounts in a structured manner.
            </p>
            <div className="flex justify-center p-5">
              <img src={chart_of_accounts_07} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Adding Accounts:</p>
            <p className="mb-4">
              To add a new account, click on the "Add New" button located within the Chart of Accounts section. This will allow you to define a new account and specify its details, such as account name, type, subtype, and other relevant information.
            </p>
            <div className="flex justify-center p-5">
              <img src={chart_of_accounts_08} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <div className="flex justify-center p-5">
              <img src={chart_of_accounts_02} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div>
            <p className="font-bold py-2 text-lg">Account Types and Subtypes:</p>
            <p className="mb-4">
              The software provides two sub-menus, "Account Type" and "Account Subtype," to manage the different types and subtypes of accounts. In these menus, you can add, edit, or delete account types and subtypes based on your specific requirements.
            </p>
            <div className="flex justify-center p-5">
              <img src={chart_of_accounts_03} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <div className="flex justify-center p-5">
              <img src={chart_of_accounts_04} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <div className="flex justify-center p-5">
              <img src={chart_of_accounts_05} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <div className="flex justify-center p-5">
              <img src={chart_of_accounts_06} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
        </div>
      )}
      {filteredContent("Transactions") && (
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center py-5">Transactions </h2>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Introduction:</p>
            <p className="mb-4">
              The Transactions section enables you to record financial transactions within the accounting software. This page will guide you through the process of adding new transactions and maintaining accurate records.
            </p>
            <div className="flex justify-center p-5">
              <img src={Transaction_01} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Adding Transactions:</p>
            <p className="mb-4">
              To add a new transaction, navigate to the Transactions menu. You will be prompted to enter the transaction details, accounts involved and amounts. This feature allows you to accurately track your income, expenses, and other financial activities.
            </p>
            <div className="flex justify-center p-5">
              <img src={Transaction_02} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
        </div>
      )}
      {filteredContent("Journal Entry") && (
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center py-5">Journal Entry</h2>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Introduction:</p>
            <p className="mb-4">
              The Journal Entry section provides a comprehensive view of all recorded transactions in chronological order. It allows you to review and print the journal entries for specific dates or periods.
            </p>
            <div className="flex justify-center p-5">
              <img src={report_02} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
        </div>
      )}
      {filteredContent("Reports") && (
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Reports</h2>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Introduction:</p>
            <p className="mb-4">
              The Reports section provides a range of financial reports to help you analyze and evaluate your business's financial performance. This page will introduce the different types of reports available.
            </p>
            <div className="flex justify-center p-5">
              <img src={report_01} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Journal Report:</p>
            <p className="mb-4">
              The Journal Report displays a detailed record of all transactions entered into the accounting software. It presents the information in a chronological order, providing a comprehensive overview of your financial activities.
            </p>
            <div className="flex justify-center p-5">
              <img src={report_02} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Ledger Report:</p>
            <p className="mb-4">
              The Ledger Report summarizes the transactions for each account, providing a clear picture of the account balances and activities over a specified period. This report helps you track individual accounts and monitor their financial status.
            </p>
            <div className="flex justify-center p-5">
              <img src={report_03} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div>
            <p className="font-bold py-2 text-lg">Income and Expense Report:</p>
            <p className="mb-4">
              The Income and Expense Report presents a breakdown of your business's income and expenses for a selected period. It allows you to identify the sources of revenue and track the expenses incurred, providing insights into your profitability.
            </p>
            <div className="flex justify-center p-5">
              <img src={report_04} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div>
            <p className="font-bold py-2 text-lg">Profit/Loss Report:</p>
            <p className="mb-4">
              The Profit/Loss Report calculates and presents the net profit or loss for a given period. It considers the income, expenses, and other financial factors to give you an accurate assessment of your business's financial health.
            </p>
            <div className="flex justify-center p-5">
              <img src={report_05} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div>
            <p className="font-bold py-2 text-lg">Accounts Receivable and Payable Report:</p>
            <p className="mb-4">
              The Accounts Receivable and Payable Report provides an overview of the amounts owed to your business (accounts receivable) and the amounts your business owes to others (accounts payable). This report helps you monitor outstanding payments and manage your cash flow effectively.
            </p>
            <div className="flex justify-center p-5">
              <img src={report_06} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
        </div>
      )}
      {filteredContent("User Management") && (
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center py-5">User Management</h2>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Introduction:</p>
            <p className="mb-4">
              The User Management section allows you to manage user accounts, assign roles, and control access to the accounting software. This page will guide you through the process of adding, editing, and deleting user accounts.
            </p>
            <div className="flex justify-center p-5">
              <img src={userManagement_01} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Adding Users:</p>
            <p className="mb-4">
              The Dashboard displays the total revenue, total expenses, and net
              profit for each date. This allows you to analyze your financial
              performance on a daily basis. The information is presented in a
              clear and concise manner, enabling you to make informed decisions.
            </p>
            <div className="flex justify-center p-5">
              <img src={userManagement_02} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div className="mb-8">
            <p className="font-bold py-2 text-lg">Role Assignment:</p>
            <p className="mb-4">
              Within the User Management section, you can assign specific roles to each user account. Roles determine the level of access and functionality available to users. Assigning roles helps maintain data integrity and security within the software.
            </p>
            <div className="flex justify-center p-5">
              <img src={userManagement_02} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
          <div>
            <p className="font-bold py-2 text-lg">Editing and Deleting Users:</p>
            <p className="mb-4">
              In the User Management section, you have the ability to edit or delete user accounts. This allows you to update user information, modify access permissions, or remove users who no longer require access to the accounting software.
            </p>
            <div className="flex justify-center p-5">
              <img src={userManagement_04} alt="" className="w-2/3 rounded-lg shadow-lg" />
            </div>
            <hr />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGuide;
