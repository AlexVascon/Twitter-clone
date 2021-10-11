
import './App.css';
import { Switch, Route, useLocation } from "react-router-dom"; 
import Navbar from "./components/navbar/Navbar";   
import HomePage from "./pages/homepage/HomePage"; 
import SignupPage from "./pages/signupPage/SignupPage";
import LoginPage from "./pages/loginPage/LoginPage";
import ProfilePage from './pages/profilePage/ProfilePage';
import Feed from './pages/feed/Feed';

import PrivateRoute from "./components/PrivateRoute"; 
import AnonRoute from "./components/AnonRoute";  

import { AnimatePresence } from 'framer-motion';
import ConfirmPage from './pages/confirmPage/ConfirmPage';
import CreatePassword from './pages/createPassword/CreatePassword';
import Prototype from './pages/prototype/Prototype';


function App() {
  const location = useLocation();
  return (
    <div className="App">
     <Navbar />
     <AnimatePresence existBeforeEnter>
       <Switch location={location} key={location.key}>      
          <Route exact path="/" component={HomePage} />
          <PrivateRoute exact path="/profile" component={ProfilePage} />
          <PrivateRoute exact path="/feed" component={Feed} />
        
          <AnonRoute exact path="/signup" component={SignupPage} />
          <AnonRoute exact path="/login" component={LoginPage} />
       </Switch>
    </AnimatePresence>
    </div>
  );
}

export default App;
