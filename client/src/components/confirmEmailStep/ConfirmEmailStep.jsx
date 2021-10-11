import React, { useState } from 'react';
import './confirmEmailStep.css';
import TextField from '@mui/material/TextField';
import TwitterIcon from '@mui/icons-material/Twitter';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function ConfirmEmailStep(props) {

    const { 
        nextStep,
        prevStep,
        email,
        verifyToken
     } = props;

    const [code, setCode] = useState('')
    const [errorMessage, setErrorMessage] = useState(undefined);

    const handleCode = e => setCode(e.target.value)

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if(code === verifyToken) nextStep();
        else setErrorMessage('invalid code, please check your emails');
    }

    return (
        <div className="confirm-step">
        <ArrowBackIcon className='back-arrow' color='primary' onClick={() => prevStep()}/>
         <TwitterIcon className='twitter-logo' color='primary'/>
            <h1 className='title'>We sent you a code</h1>
            <p className='subtext'>Enter it below to verify {email}</p>
            <form className='confirm-form' onSubmit={handleFormSubmit}>
                <TextField className='input-code' id="standard-basic" label="Verification code" variant="standard" value={code} onChange={handleCode}/>
                <Divider className='divider-2' variant="middle" />
                <button className='next-button-2' type='submit'>
                Next
                </button>
            </form>
            { errorMessage && <p className="error-message">{errorMessage}</p> }
        </div>
    )
}
