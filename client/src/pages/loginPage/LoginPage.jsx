import { useState, useContext } from "react";
import './loginPage.css';
import axios from '../../service/api'
import { AuthContext } from '../../context/auth.context';
import LoginStartStep from "../../components/loginStartStep/LoginStartStep";
import LoginPassword from "../../components/loginPassword/LoginPassword";


function LoginPage(props) {

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { logInUser } = useContext(AuthContext);

  const handleLoginSubmit = async (e) => {
      e.preventDefault();

      try {
        const requestBody = { email, password };
        const res = await axios.post('auth/login', requestBody)
        const token = await res.data?.authToken;               
        await logInUser(token);                                  
        await props.history.push('/');
      } catch (error) {
        console.error(error);
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
     setEmail={setEmail}
      /> )
     case 2: 
     return ( <LoginPassword 
       email={email}
       password={password}
       setPassword={setPassword}
       handleLoginSubmit={handleLoginSubmit}
     /> )
     default:
   }
 }
  
  return (
    <div className="LoginPage">
      {renderStep()}
    </div>
  )
}

export default LoginPage;
