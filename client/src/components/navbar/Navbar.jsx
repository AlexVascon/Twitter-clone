import React from 'react'
import { Link } from "react-router-dom";
import { useContext } from "react";                      
import { AuthContext } from "../../context/auth.context";

export default function Navbar() {

  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
    return (
        <nav>
          <Link exact to="/">
            <button>Home</button>
          </Link>
     
          {isLoggedIn ? 
          (<>
            <Link to="/projects">
              <button>Projects</button>
            </Link>
            <button onClick={logOutUser}>Logout</button>
            <span>{user.firstName}</span>
          </>)
        : 
        (<>
          <Link to="/signup"> <button>Signup</button> </Link>
          <Link to="/login"> <button>Login</button> </Link>
        </>)
      }
        </nav>
      );
}
