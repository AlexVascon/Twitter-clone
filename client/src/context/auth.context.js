import React, { useState, useEffect } from "react";
import axios from '../service/api';
import { useHistory } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {

  const history = useHistory();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const verifyStoredToken = async () => {
      try {
        setUser(null);
        const storedToken = localStorage.getItem('authToken');
        if(storedToken) {
            const res = await axios.get('auth/verify', { headers: { Authorization: `Bearer ${storedToken}`} });
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
  
  const logInUser = async (token) => {    
    try {
      localStorage.setItem('authToken', token); 
      await verifyStoredToken();  
    } catch (err) {
      console.error(err);
    }                           
  }

  const logOutUser = () => {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("authToken");
  }

  useEffect(() => {                                    
    verifyStoredToken();             
   }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, logInUser, logOutUser, setUser }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthProviderWrapper, AuthContext };
