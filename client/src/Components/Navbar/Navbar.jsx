import { useContext } from "react";
import logo from "../../assets/logo/logo.png";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="print:hidden print-hidden">
      {/* header */}
      {/* desktop */}
      <div className="md:block hidden">
        <div className="h-16  flex justify-between relative bg-white px-4 sm:px-6 md:px-8">
          {/* logo */}
          <div className=" flex items-center justify-start ">
            <Link to={"/"}>
              <img className="object-cover w-[70%] " src={logo} alt="" />
            </Link>
          </div>
          {/* logo end */}

          {/* search and others */}
          <div className="hidden lg:flex items-center justify-evenly">
            {/* search */}
            {/* <div className="rounded-full">
            <input
              className="w-full rounded-full px-3 py-1 outline-none bg-[#ECEDEF]"
              type="text"
              placeholder="Search"
            />
          </div> */}
            {/* search ends */}

            {/* others */}
            <div className="flex items-center ml-6 pl-6 text-xl">
              <button>{/* <CiDark /> */}</button>
              {/* <a href="/" className="ml-6">
              <img
                className="w-9 h-9 rounded-full object-cover cursor-pointer"
                src={userPic}
                alt=""
              />
            </a> */}
              <button onClick={logout} className="ml-6">
                {user ? "Logout" : "Login"}
              </button>
            </div>
          </div>
          {/* nav and others ends */}
        </div>
      </div>

      {/* mobile */}
      <div className="md:hidden block ">
        <div className="flex items-center justify-center h-12 border-b bg-white">
          {/* logo */}
            <Link to={"/"} className="ml-6 flex items-center justify-center">
            <img className="object-contain w-[90%] h-12 " src={logo} alt="" />
            </Link>
          {/* logo end */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
