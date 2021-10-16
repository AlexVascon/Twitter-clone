import { useState, useContext } from "react";
import './loginPage.css';
import { useHistory } from "react-router-dom";
import axios from '../../service/api'
import { AuthContext } from '../../context/auth.context';
import LoginStepOne from "../../components/loginSteps/loginStepOne/LoginStepOne";
import LoginStepTwo from "../../components/loginSteps/loginStepTwo/LoginStepTwo";


export default function LoginPage() {

  const history = useHistory();

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

        history.push('/profile');           
        await logInUser(token);  

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
     return ( <LoginStepOne
     nextStep={nextStep}
     setEmail={setEmail}
      /> )
     case 2: 
     return ( <LoginStepTwo
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

