// src/context/auth.context.js

import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = "http://localhost:5005";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const verifyStoredToken = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        if(storedToken) {
            const res = await axios.get(`${API_URL}/auth/verify`, { headers: { Authorization: `Bearer ${storedToken}`} });
            const user = res.data;
            setUser(user);
            setIsLoggedIn(true);
            setIsLoading(false);
        } else {
            setIsLoggedIn(false);
            setUser(null);
            setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
  }
  
  const logInUser = (token) => {                              
    localStorage.setItem('authToken', token);
  }

  const logOutUser = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUser(null);
  }

  useEffect(() => {                                    
    verifyStoredToken();                  
   }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, logInUser, logOutUser }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthProviderWrapper, AuthContext };
