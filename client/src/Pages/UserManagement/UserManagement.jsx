import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import Select from "react-select";
import { toast } from "react-toastify";
import Modal from "../../Components/Modal/Modal";
import axios from "../../utils/axiosInstance";
import DeleteUserModal from "./deleteUserModal";
const UserManagement = () => {
  const [userData, setUserData] = useState([]);
  const [isPassMatch, setIsPassMatch] = useState(false);
  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    role: null,
    gender: null,
    phone: "",
    email: "",
  });
  const [openDeleteModalIndex, setOpenDeleteModalIndex] = useState(-1);

  const openDeleteModal = (index) => {
    setOpenDeleteModalIndex(index);
  };

  const closeDeleteModal = () => {
    setOpenDeleteModalIndex(-1);
  };

  // Remove the deleted user from userData state
  const deleteUserData = (userId) => {
    setUserData((prevUser) => prevUser?.filter((user) => user._id !== userId));
  };

  //   set user data
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const accessToken = JSON.parse(token);
    const getUserData = async () => {
      const response = await axios.get("/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // fetched user array
      setUserData(response.data.users);
    };
    getUserData();
  }, [formData]);

  const handleEdit = ({ fullName, username, phone, email, _id }) => {
    // Handle edit action for the given id
    setEdit(true);
    setId(_id);
    setFormData({
      fullName: fullName,
      username: username,
      phone: phone,
      email: email,
      password: "",
    });
  };

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  useEffect(() => {
    formData.password === confirmPass
      ? setIsPassMatch(true)
      : setIsPassMatch(false);
  }, [confirmPass]);
  const handleRoleChange = (selectedOption) => {
    setFormData((prevData) => ({ ...prevData, role: selectedOption.label }));
  };

  const handleGenderChange = (selectedOption) => {
    setFormData((prevData) => ({ ...prevData, gender: selectedOption.label }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    const token = localStorage.getItem("accessToken");
    const accessToken = JSON.parse(token);
    const postUserData = async () => {
      try {
        const response = await axios.post("/user", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.status);
        toast.success("New User Add successfully.");
        // Reset the form after submission
        setFormData({
          fullName: "",
          username: "",
          password: "",
          role: null,
          gender: null,
          phone: "",
          email: "",
        });
        setConfirmPass("");
      } catch (error) {
        if (error?.response?.data?.message) {
          return toast.error(error?.response?.data?.message);
        } else {
          return toast.error(error?.message);
        }
      }
    };
    const editUser = async (id) => {
      console.log("updating", id);
      try {
        const response = await axios.put(`/user/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast.success("User updated successfully.");
        // Reset the form after submission
        setFormData({
          fullName: "",
          username: "",
          password: "",
          role: null,
          gender: null,
          phone: "",
          email: "",
        });
        setConfirmPass("");
        setEdit(false);
      } catch (error) {
        console.log("error.response", error);
        toast.error(error.message);
      }
    };
    edit ? editUser(id) : postUserData();
  };
  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold text-center my-5"> User Management</h1>
      {/* main container */}
      <div className="">
        {/* table */}
        <div className=" ">
          <table className=" mx-auto w-[70%] divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData?.map((item, index) => (
                <tr key={item._id}>
                  <td className="py-3 px-4">{item.fullName}</td>
                  <td className="py-3 px-4">{item.role}</td>
                  <td className="py-3 px-4">{item.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <button
                        className="mr-2 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(item)}
                      >
                        <RiEdit2Line size={20} />
                      </button>
                      {/* delete button */}
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          openDeleteModal(index);
                        }}
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                      {openDeleteModalIndex === index && (
                        <Modal isOpen={true} onClose={closeDeleteModal}>
                          <DeleteUserModal
                            userId={item._id}
                            closeModal={closeDeleteModal}
                            deleteUser={deleteUserData}
                          />
                        </Modal>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* button */}
        <div className="my-5 mt-16">
          <h3 className="text-center text-xl font-semibold block ">
            {edit ? "Update User" : "Add New User"}
          </h3>
        </div>

        {/* form */}
        <div className=" ">
          <form onSubmit={handleSubmit} className="mx-auto w-[70%]">
            {/* full name and role */}
            <div className="  flex gap-3">
              {/* fullName */}
              <div className="mb-3  w-1/2 ">
                <label htmlFor="fullName" className="block mb-2 font-medium">
                  Full Name{" "}
                  {!edit ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-gray-500">(Optional)</span>
                  )}
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter the full name"
                  className="w-full px-3 py-[6px]  border-gray-300 rounded"
                  required
                />
              </div>
              {/* role */}
              <div className="mb-3  w-1/2 ">
                <label htmlFor="role" className="block mb-2 font-medium">
                  Role{" "}
                  {!edit ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-gray-500">(Optional)</span>
                  )}
                </label>
                <Select
                  id="role"
                  name="role"
                  value={formData.role?.label}
                  onChange={handleRoleChange}
                  options={roles}
                  className=""
                  placeholder="Select a role"
                  required
                />
              </div>
            </div>

            {/* username and gender */}
            <div className=" flex gap-3">
              {/* username */}
              <div className=" w-1/2">
                <label htmlFor="username" className="block mb-2 font-medium">
                  User Name{" "}
                  {!edit ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-gray-500">(Optional)</span>
                  )}
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter the username"
                  className="w-full px-3 py-[6px] border border-gray-300 rounded"
                  required
                />
              </div>

              {/* gender */}
              <div className="mb-3 w-1/2">
                <label htmlFor="gender" className="block mb-2 font-medium">
                  Gender{" "}
                  {!edit ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-gray-500">(Optional)</span>
                  )}
                </label>
                <Select
                  id="gender"
                  name="gender"
                  value={formData.gender?.label}
                  onChange={handleGenderChange}
                  options={genders}
                  className=" "
                  placeholder="Select a Gender"
                />
              </div>
            </div>

            {/* password */}
            <div className="mb-3 flex gap-3">
              <div className="w-1/2">
                <label htmlFor="password" className="block mb-2 font-medium">
                  Password{" "}
                  {!edit ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-gray-500">(Optional)</span>
                  )}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                  className="w-full px-3 py-[6px] border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 font-medium"
                >
                  Confirm Password{" "}
                  {!edit ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-gray-500">(Optional)</span>
                  )}
                </label>
                <input
                  className={`w-full px-3 py-[6px] transition-all duration-500 border border-gray-300 rounded ${
                    isPassMatch ? "bg-white" : " bg-red-400"
                  }`}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="********"
                  value={confirmPass}
                  onChange={(e) => {
                    setConfirmPass(e.target.value);
                  }}
                  required
                />
              </div>
            </div>

            {/* phone and email */}
            <div className="flex gap-3">
              {/* phone */}
              <div className="mb-3 w-1/2">
                <label htmlFor="name" className="block mb-2 font-medium">
                  Phone{" "}
                  {!edit ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-gray-500">(Optional)</span>
                  )}
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+880 1000000000"
                  className="w-full px-3 py-[6px] border border-gray-300 rounded"
                  required
                />
              </div>
              {/* email */}
              <div className="mb-3 w-1/2">
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email{" "}
                  {!edit ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-gray-500">(Optional)</span>
                  )}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@gmail.com"
                  className="w-full px-3 py-[6px] border border-gray-300 rounded"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isPassMatch}
              className={`px-4 py-2  text-white rounded-sm  ${
                !isPassMatch
                  ? "bg-primary-100"
                  : "hover:bg-blue-700 bg-primary-300"
              }`}
            >
              {edit ? "Update User" : "Add User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
