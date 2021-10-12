import { useState, useContext } from "react";
import './loginPage.css';
import axios from "axios";
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/auth.context';
import LoginStartStep from "../../components/loginStartStep/LoginStartStep";
import LoginPassword from "../../components/loginPassword/LoginPassword";

const API_URL = "http://localhost:5005";


function LoginPage(props) {

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { logInUser } = useContext(AuthContext); 

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  
  const handleLoginSubmit = async (e) => {
      e.preventDefault();

      try {
        const requestBody = { email, password };
        const res = await axios.post(`${API_URL}/auth/login`, requestBody)
        const token = await res.data?.authToken;               
        await logInUser(token);                                  
        await props.history.push('/');
      } catch (error) {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      }
  };

  const nextStep = () => {
    setStep(step => step = step + 1)
 }

 const prevStep = () => {
     setStep(step => step = step - 1)
 }

 const renderStep = () => {
   switch(step) {
     case 1: 
     return ( <LoginStartStep 
     nextStep={nextStep}
      /> )
     case 2: 
     return ( <LoginPassword /> )
     default:
   }
 }
  
  return (
    <div className="LoginPage">
    {/* <TwitterIcon className='twitter-logo' color='primary'/>
      <h1 className='login-title'>To get started, first enter your phone, email address or @username</h1>

      <form className='login-form' onSubmit={handleLoginSubmit}>
        <label>Email:</label>
        <input type="text" name="email" value={email} onChange={handleEmail} />

        <label>Password:</label>
        <input type="password" name="password" value={password} onChange={handlePassword} />

        <button type="submit">Login</button>
      </form>
      { errorMessage && <p className="error-message">{errorMessage}</p> }

      <p>Don't have an account yet?</p>
      <Link to={"/signup"}> Sign Up</Link> */}
      {renderStep()}
    </div>
  )
}

export default LoginPage;
