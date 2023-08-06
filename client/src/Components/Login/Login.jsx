import React, { useContext, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      // User is already authenticated, redirect to the dashboard
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();

    try {
      setIsLoading(true);
      await login(username, password);
      // Handle successful login, such as redirecting to another page
      navigate("/");
    } catch (error) {
      if (error.response) {
        // Server responded with an error status (e.g., 400, 401, 500)
        setError(error.response.data.message);
      } else {
        // An unexpected error occurred
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="#"
        className="flex items-center mb-6 text-2xl  text-primary-300 font-extrabold"
      >
        KIB Accounting
      </a>
      <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-semibold leading-tight tracking-tight md:text-2xl">
            Login to your account
          </h1>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <form className="space-y-4 md:space-y-6" action="#">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Your username or email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50 border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="username or email"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="•••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required=""
              />
            </div>
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center text-white bg-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mx-2 my-0.5" /> Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
