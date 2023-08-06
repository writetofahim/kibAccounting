import React, { useEffect, useState } from "react";
import { AiOutlineUp } from "react-icons/ai";
import AccountForm from "../../Components/AccountForm/AccountForm";
import AccountsTable from "../../Components/AccountsTable/AccountsTable";
import Modal from "../../Components/Modal/Modal";
import axios from "../../utils/axiosInstance";

const ChartOfAccounts = () => {
  const [loading, setLoading] = useState(true);
  const [accountTypes, setAccountTypes] = useState([]);
  const [error, setError] = useState(null);

  const [selectedAccountType, setSelectedAccountType] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const accessToken = JSON.parse(token);
    setLoading(true); // Set loading to true before making the API call
    axios
      .get("/account-types", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setAccountTypes(res.data.accountTypes);
        setLoading(false); // Set loading to false after receiving the response
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  const handleClick = (type) => {
    setSelectedAccountType(type);
    if (selectedAccountType._id === type._id) {
      setSelectedAccountType(null);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-5 relative">
      {/* add new modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="bg-black/50 backdrop-blur-sm md:w-[600px] ">
          <div className="bg-white p-3">
            <h3 className="text-center font-semibold text-xl">
              Add New Account
            </h3>
            <AccountForm />
          </div>
        </div>
      </Modal>

      {/* top section */}
      <div className="">
        <h1 className="font-[700] text-2xl text-center">Chart Of Accounts</h1>
        <div className=" flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-300 text-white px-2 py-1 rounded-sm"
          >
            Add New Account
          </button>
        </div>
      </div>
      {/* top section ends */}

      {/* bottom section */}
      <div className=" mt-3 w-full mx-auto">
        {/* account */}
        {loading ? (
          // Loading skeleton
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
          </div>
        ) : error ? (
          // Error message
          <div className="text-red-500">{error}</div>
        ) : (
          accountTypes?.map((type) => (
            <div key={type._id} className="mb-3">
              <div
                onClick={() => handleClick(type)}
                className={`border-gray-500 border-2 cursor-pointer px-2 py-1  flex justify-between ${
                  selectedAccountType?._id === type._id
                    ? "border-primary-300"
                    : ""
                }`}
              >
                <div className="">
                  <h3 className="capitalize">{type.typeName}</h3>
                </div>
                <div className="flex items-center">
                  <AiOutlineUp
                    className={`${
                      selectedAccountType?._id === type._id ? "" : "rotate-180"
                    } duration-500`}
                  />{" "}
                </div>
              </div>
              <div>
                {selectedAccountType?._id === type._id ? (
                  <AccountsTable selectedAccountType={selectedAccountType} />
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
      {/* bottom section ends */}
    </div>
  );
};

export default ChartOfAccounts;
