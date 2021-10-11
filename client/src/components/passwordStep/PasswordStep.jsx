import React, { useState} from 'react';
import './passwordStep.css';
import TwitterIcon from '@mui/icons-material/Twitter';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';


export default function PasswordStep(props) {

    const { 
        password, 
        handlePasswordChange, 
        nextStep
    } = props;

    const [errorMessage, setErrorMessage] = useState(undefined);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(password)) {
        setErrorMessage('Must include uppercase, number and special character')
        return;
        }
        nextStep(); 
    }
    
    return (
        <div>
            <TwitterIcon className='twitter-logo' color='primary'/>
            <h1 className='title'>You'll need a password</h1>
            <p className='subtext'>Make sure it's 8 characters or more.</p>
            <form className='password-form' onSubmit={handlePasswordSubmit}>
            <TextField className='input-password' id="standard-basic" label="Password" variant="standard" value={password} onChange={handlePasswordChange}/>
            <Divider className='divider-3' variant="middle" />
            <button className='next-button-3' type='submit'>Next</button>
            </form>
            { errorMessage && <p className="error-message">{errorMessage}</p> }
        </div>
    )
}
