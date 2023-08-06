import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Sidebar from "../Components/Sidebar/Sidebar";
import { AuthContext } from "../contexts/AuthContext";
import axios from "../utils/axiosInstance";

const Main = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      navigate({
        pathname: "/login",
        state: { from: location.pathname },
      });
    } else {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      axios.interceptors.request.use(
        (config) => {
          config.headers["Authorization"] = `Bearer ${token}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className=" bg-[#ECEDEF]">
      <div className="relative bg-[#ECEDEF]">
        <Navbar />
        <div className="flex">
          <div className="print-hidden z-50">
            <Sidebar />
          </div>
          <section className="w-full md:h-[calc(100vh-64px)] h-[calc(100vh-48px)] overflow-y-scroll pb-16">
            <Outlet />
          </section>
        </div>

        {/* <Footer/> */}
      </div>
    </div>
  );
};

export default Main;
