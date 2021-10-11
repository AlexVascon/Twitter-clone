import React, { useState} from 'react'
import ConfirmEmailStep from '../../components/confirmEmailStep/ConfirmEmailStep';
import PasswordStep from '../../components/passwordStep/PasswordStep';
import StartSignupStep from '../../components/startSignupStep/StartSignupStep';


export default function SignupPage() {

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [birthday, setBirthday] = useState('');
    const [verifyToken, setVerifyToken] = useState('');
    const [password, setPassword] = useState('');

    const handleNameChange = e => setName(e.target.value);
    const handleEmailChange = e => setEmail(e.target.value);
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
                return ( <StartSignupStep
                nextStep={nextStep}
                name={name}
                handleNameChange={handleNameChange}
                email={email}
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
                return ( <ConfirmEmailStep
                nextStep={nextStep}
                prevStep={prevStep}
                email={email}
                verifyToken={verifyToken}
                handleVerifyTokenChange={handleVerifyTokenChange}
                /> )
            case 3: 
                return ( <PasswordStep
                password={password}
                handlePasswordChange={handlePasswordChange}
                nextStep={nextStep}
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
