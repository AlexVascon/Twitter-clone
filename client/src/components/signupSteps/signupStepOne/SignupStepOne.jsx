import { useState } from "react";
import './signupStepOne.css';
import TwitterIcon from '@mui/icons-material/Twitter';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { motion } from 'framer-motion';
import WheelPicker from 'react-simple-wheel-picker';
import axios from '../../../service/api';


const containerVariants = {
    hidden: {
        opacity: 0,
        x: '100vw'
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring',
            delay: 0.5
        }
    },
    exist: {
        x: '-100vw',
        transition: { ease: 'easeInOut' }
    }
}

const days = [{id: '1', value: '01'},{id: '2', value: '02'},{id: '3', value: '03'},{id: '4', value: '04'},{id: '5', value: '05'},{id: '6', value: '06'},{id: '7', value: '07'},{id: '8', value: '08'},{id: '9', value: '09'},{id: '10', value: '10'},{id: '11', value: '11'},{id: '12', value: '12'},{id: '13', value: '13'},{id: '14', value: '14'},{id: '15', value: '15'},{id: '16', value: '16'},{id: '17', value: '17'},{id: '18', value: '18'},{id: '19', value: '20'},{id: '21', value: '21'},{id: '22', value: '22'},{id: '23', value: '23'},{id: '24', value: '24'},{id: '25', value: '26'},{id: '27', value: '27'},{id: '28', value: '28'},{id: '29', value: '29'},{id: '30', value: '30'},{id: '31', value: '31'}]
const months = [{id: '1', value: '01'},{id: '2', value: '02'},{id: '3', value: '03'},{id: '4', value: '04'},{id: '5', value: '05'},{id: '6', value: '06'},{id: '7', value: '07'},{id: '8', value: '08'},{id: '9', value: '09'},{id: '10', value: '10'},{id: '11', value: '11'},{id: '12', value: '12'}]
const years = [{id: '1', value: '1980'}]

for(let i = 0; i <= 40; i++) {
    const newId = Number(years[i].id) + 1;
    const newValue = Number(years[i].value) + 1;
    const newYear = { id: newId + '', value: newValue + ''}
    years.push(newYear)
}

export default function SignupStepOne(props) {

  const {
    nextStep,
    name,
    handleNameChange, 
    day,
    handleDayChange, 
    email,
    emailError,
    handleEmailChange, 
    month,
    handleMonthChange, 
    year,
    handleYearChange, 
    setVerifyToken,
    setBirthday } = props;

  const [errorMessage, setErrorMessage] = useState(undefined);

  const handleSignupSubmit = async (e) => {
      e.preventDefault();

      try {
        const birthday = {
            day: day,
            month: month,
            year: year
        };
        setBirthday(birthday); // store for final step

        const requestBody = { email, name };

        const setEmailToken = await axios.post('auth/setup', requestBody);
        setVerifyToken(setEmailToken?.data?.emailToken);
        nextStep();
      } catch (err) {
        console.error(`signup step one: ${err}`)
        const errorDescription = err?.response?.data?.message;
        setErrorMessage(errorDescription);
      }
  };

  return (
    <motion.div
    variants={containerVariants}
    initial='hidden'
    animate='visible'
    exit='exit'
    >
    <div className="signupPage">
    <TwitterIcon className='twitter-logo' color='primary'/>
      <h1 className='title'>Create your account</h1>
      <form className='signup-form' onSubmit={handleSignupSubmit}>
      <TextField className='input-name' id="standard-basic" label="Name" variant="standard" value={name} onChange={handleNameChange} />
      <TextField className='input-email' id="standard-basic" label="Email address" variant="standard" value={email} onChange={handleEmailChange} helperText={emailError}/>
      <TextField className='input-birthday' id="standard-basic"  variant="standard" value={day + " " + month + " " + year} />
      <div className='wheel-picker'>
      <WheelPicker 
            data={days}
            onChange={handleDayChange}
            height={150}
            width={30}
            titleText="Enter value same as aria-label"
            itemHeight={30}
            selectedID={days[0].id}
            color="#ccc"
            activeColor="#333"
            backgroundColor="#fff"
            focusColor='false'
            shadowColor='false'
      />
       <WheelPicker 
            data={months}
            onChange={handleMonthChange}
            height={150}
            width={30}
            titleText="Enter value same as aria-label"
            itemHeight={30}
            selectedID={months[0].id}
            color="#ccc"
            activeColor="#333"
            backgroundColor="#fff"
            focusColor='false'
            shadowColor='false'
      />
      <WheelPicker 
            data={years}
            onChange={handleYearChange}
            height={150}
            width={30}
            titleText="Enter value same as aria-label"
            itemHeight={30}
            selectedID={years[0].id}
            color="#ccc"
            activeColor="#333"
            backgroundColor="#fff"
            focusColor='false'
            shadowColor='false'
      />
      </div>
        <Divider className='divider' variant="middle" />
        <button className='next-button-1' type="submit">
        Next
        </button>
      </form>
      { errorMessage && <p className="error-message">{errorMessage}</p> }
    </div>
    </motion.div>
  )
}

