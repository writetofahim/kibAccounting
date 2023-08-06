import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "../../utils/axiosInstance";

const AccountForm = ({ account }) => {
  const [fetchedAccountTypes, setFetchedAccountTypes] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [description, setDescription] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountSubType, setAccountSubType] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [fetchedAccountSubTypes, setFetchedAccountSubTypes] = useState([]);
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [selectedAccountSubType, setSelectedAccountSubType] = useState(null);
  const [selectedAccountTypeId, setSelectedAccountTypeId] = useState(null);
  const [selectedAccountTypeSubId, setSelectedAccountSubTypeId] =
    useState(null);

  const [accountCategories, setAccountCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { user } = useContext(AuthContext);

  // get tokens from local storage
  const token = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(token);

  // fetching account types
  useEffect(() => {
    const getAccountTypes = async () => {
      try {
        const response = await axios.get("/account-types", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // fetched account types array
        setFetchedAccountTypes(response.data.accountTypes);
      } catch (error) {
        console.error("Error fetching account types:", error);
      }
    };

    getAccountTypes();
  }, []);

  // created an array to load options of account type with id and type
  const accountTypes = fetchedAccountTypes.map((accountType) => {
    return { value: accountType?._id, label: accountType?.typeName };
  });

  // fetching account sub types
  useEffect(() => {
    const getAccountSubTypes = async () => {
      const response = await axios.get("/account-sub-types", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // fetched account sub types array
      setFetchedAccountSubTypes(response.data.accountSubTypes);
    };
    getAccountSubTypes();
  }, []);

  // fetching account categories
  useEffect(() => {
    const getAccountCategories = async () => {
      const response = await axios.get("/account-categories", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // fetched account sub types array
      setAccountCategories(response.data.accountCategories);
    };
    getAccountCategories();
  }, []);

  // handle account type change
  const handleAccountTypeChange = (selectedAccountType) => {
    setSelectedAccountType(selectedAccountType);
    // set selected account type id to filter related sub types
    setSelectedAccountTypeId(selectedAccountType.value);
    setSelectedAccountSubType(null);
    setSelectedAccountSubTypeId(null);
  };

  // created an array to load options of account sub type
  const accountSubTypes = fetchedAccountSubTypes
    .filter((subType) => subType.accountTypeId._id === selectedAccountTypeId)
    .map((accountSubType) => {
      return { value: accountSubType?._id, label: accountSubType?.subTypeName };
    });

  // handle account sub type change
  const handleAccountSubTypeChange = (selectedAccountSubType) => {
    setSelectedAccountSubType(selectedAccountSubType);
    // set selected account type id to filter related sub types
    setSelectedAccountSubTypeId(selectedAccountSubType.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      const accessToken = JSON.parse(token);

      const accountData = {
        accountName,
        accountTypeId: selectedAccountType.value,
        accountSubTypeId: selectedAccountSubType.value,
        openingBalance: Number(openingBalance),
        description,
        createdBy: user._id,
        accountCategoryId: selectedCategory.value,
      };

      // return console.log(accountData);

      if (account) {
        const response = await axios.put(
          `/accounts/${account._id}`,
          accountData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast.success("Account updated successfully");
      } else {
        const response = await axios.post(`/accounts`, accountData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast.success("Account created successfully");
        console.log("Account created:", response.data);

        // Reset form fields
        setAccountName("");
        setDescription("");
        setAccountType("");
        setAccountSubType("");
        setOpeningBalance("");
        setSelectedAccountType(null);
        setSelectedAccountSubType(null);
        setSelectedAccountTypeId(null);
        setSelectedAccountSubTypeId(null);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Error creating account");
    }
  };

  // Load the account details when in edit mode
  useEffect(() => {
    if (account) {
      setAccountName(account.accountName);
      setDescription(account.description);
      setOpeningBalance(account.openingBalance);

      // Preselect the account type
      const selectedType = fetchedAccountTypes.find(
        (type) => type._id === account.accountTypeId._id
      );
      setSelectedAccountType({
        value: selectedType?._id,
        label: selectedType?.typeName,
      });

      // Preselect the account subtype
      const selectedSubType = fetchedAccountSubTypes.find(
        (subtype) => subtype._id === account.accountSubTypeId._id
      );
      setSelectedAccountSubType({
        value: selectedSubType?._id,
        label: selectedSubType?.subTypeName,
      });

      // Preselect the account category
      const selectedCat = accountCategories.find(
        (category) => category._id === account.accountCategoryId._id
      );

      setSelectedCategory({
        value: selectedCat?._id,
        label: selectedCat?.name,
      });
    }
  }, [account, fetchedAccountTypes, fetchedAccountSubTypes, accountCategories]);

  const handleAccountCategoryChange = (option) => {
    console.log(option);
    setSelectedCategory(option);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="mb-4">
        <label htmlFor="accountName" className="block mb-2 font-medium">
          Account Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-primary-600 focus:border-primary-600"
          placeholder="Enter the account name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block mb-2 font-medium">
          Description<span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-primary-600 focus:border-primary-600"
          placeholder="Description about the account"
          rows="4"
        />
      </div>

      {/* account type */}
      <div className="mb-4 ">
        <label htmlFor="accountType" className="block mb-2 font-medium">
          Account Type<span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <Select
            options={accountTypes}
            value={selectedAccountType}
            onChange={handleAccountTypeChange}
            className="w-full"
          />
          {/* account-type */}
          {/* <button
            type="button"
            className="w-10 h-10 text-white bg-primary-300 rounded-lg"
          >
            +
          </button> */}
        </div>
      </div>

      {/* account sub type */}
      <div className="mb-4">
        <label htmlFor="accountSubType" className="block mb-2 font-medium">
          Account Sub Type<span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <Select
            options={accountSubTypes}
            value={selectedAccountSubType}
            onChange={handleAccountSubTypeChange}
            className="w-full"
          />
          {/* <button
            type="button"
            className="w-10 h-10 text-white bg-primary-300 rounded-lg"
          >
            +
          </button> */}
        </div>
      </div>

      {/* account sub type */}
      <div className="mb-4">
        <label htmlFor="accountSubType" className="block mb-2 font-medium">
          Account Category<span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <Select
            options={accountCategories.map((cat) => {
              return { ...cat, value: cat._id, label: cat.name };
            })}
            value={selectedCategory}
            onChange={handleAccountCategoryChange}
            className="w-full"
          />
          {/* <button
            type="button"
            className="w-10 h-10 text-white bg-primary-300 rounded-lg"
          >
            +
          </button> */}
        </div>
      </div>
      {!account && (
        <div className="mb-4">
          <label htmlFor="openingBalance" className="block mb-2 font-medium">
            Opening Balance <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="number"
            id="openingBalance"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-primary-600 focus:border-primary-600"
            required
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-primary-500 text-white rounded-lg px-4 py-2 font-medium"
      >
        Submit
      </button>
    </form>
  );
};

export default AccountForm;
