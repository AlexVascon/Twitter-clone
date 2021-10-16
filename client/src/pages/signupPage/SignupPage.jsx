import React, { useState } from 'react'
import SignupStepFour from '../../components/signupSteps/signupStepFour/SignupStepFour';
import SignupStepOne from '../../components/signupSteps/signupStepOne/SignupStepOne';
import SignupStepThree from '../../components/signupSteps/signupStepThree/SignupStepThree';
import SignupStepTwo from '../../components/signupSteps/signupStepTwo/SignupStepTwo';


export default function SignupPage() {

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [birthday, setBirthday] = useState('');
    const [verifyToken, setVerifyToken] = useState('');
    const [password, setPassword] = useState('');

    const handleNameChange = e => setName(e.target.value);
    const handleEmailChange = e => {
      setEmail(e.target.value)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) setEmailError('Please enter a valid email.'); 
        else setEmailError('');   
    };
    const handleDayChange = e => setDay(e.value);
    const handleMonthChange = e => setMonth(e.value);
    const handleYearChange = e => setYear(e.value);
    const handleVerifyTokenChange = e => setVerifyToken(e.target.value);
    const handlePasswordChange = e => setPassword(e.target.value);

    const nextStep = () => {
       setStep(step => step = step + 1)
    }

    const prevStep = () => {
        setStep(step => step = step - 1)
    }

    const renderMultiForm = () => {
        switch(step) {
            case 1:
                return ( <SignupStepOne
                nextStep={nextStep}
                name={name}
                handleNameChange={handleNameChange}
                email={email}
                emailError={emailError}
                handleEmailChange={handleEmailChange}
                day={day}
                handleDayChange={handleDayChange}
                month={month}
                handleMonthChange={handleMonthChange}
                year={year}
                handleYearChange={handleYearChange}
                birthday={birthday}
                setBirthday={setBirthday}
                setVerifyToken={setVerifyToken}
                 />)
            case 2: 
                return ( <SignupStepTwo
                nextStep={nextStep}
                prevStep={prevStep}
                email={email}
                verifyToken={verifyToken}
                handleVerifyTokenChange={handleVerifyTokenChange}
                /> )
            case 3: 
                return ( <SignupStepThree
                password={password}
                handlePasswordChange={handlePasswordChange}
                nextStep={nextStep}
                 /> )
            case 4: 
                return ( <SignupStepFour
                name={name}
                password={password}
                email={email}
                day={day}
                month={month}
                year={year}
                 /> )
            default: 
        }
    }
    return (
        <>
            {renderMultiForm()}
        </>
    )
}
