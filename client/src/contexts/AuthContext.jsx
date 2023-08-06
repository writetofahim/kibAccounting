import React, { createContext, useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
  // State variables
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check if the user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  // Function to handle user login
  const login = async (username, password) => {
    try {
      // Make the login request to your backend API
      const response = await axios.post("/auth/login", { username, password });
      const userData = response.data;
      // Set the user data in the state
      setUser(userData);

      // Save the access token to localStorage or cookies
      localStorage.setItem("accessToken", JSON.stringify(userData.token));
      localStorage.setItem("user", JSON.stringify(userData.user));
    } catch (error) {
      // Handle login error
      console.error("Failed to login:", error);
      throw error;
    }
  };

  // Function to handle user logout
  const logout = () => {
    // Remove the user data from the state
    setUser(null);

    // Clear the access token from localStorage or cookies
    localStorage.removeItem("accessToken");
  };

  // Effect to check if the user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const token = JSON.parse(accessToken);
      if (token) {
        try {
          // Make a request to your backend API to validate the token and get the user data
          const response = await axios.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = response.data;
          // Set the user data in the state
          setUser(userData.user);
          localStorage.setItem("user", JSON.stringify(userData.user));
        } catch (error) {
          // Handle error
          console.error("Failed to fetch user data:", error);
        }
      }

      // Set loading to false
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Render the AuthContextProvider with the provided children components
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
