import React from 'react'
import './loginPassword.css'
import TextField from '@mui/material/TextField';
import TwitterIcon from '@mui/icons-material/Twitter';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function LoginPassword(props) {

    const { 
        password,
        setPassword,
        handleLoginSubmit
     } = props;

    const handlePasswordChange = e => setPassword(e.target.value);

    return (
        <div className='login-password-step-page'>
        <TwitterIcon className='twitter-logo' color='primary'/>
            <h1 className='password-title'>Enter your password</h1>
            <form className='password-login-form' onSubmit={handleLoginSubmit}>
            <TextField className='input-login-password' id="standard-basic" label="Password" variant="standard" value={password} onChange={handlePasswordChange}/>
                <Divider className='divider-login-password-step' variant="middle" />
                <button type='submit' className='password-btn'>Next</button>
            </form>
        </div>
    )
}
