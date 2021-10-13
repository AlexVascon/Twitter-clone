import React, { useState} from 'react'
import './loginPassword.css'
import TextField from '@mui/material/TextField';
import TwitterIcon from '@mui/icons-material/Twitter';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../../service/api';
import { useHistory } from "react-router-dom";

export default function LoginPassword(props) {

    const { email } = props;

    const history = useHistory();

    const [password, setPassword] = useState('');

    const handlePasswordChange = e => setPassword(e.target.value);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { password, email }
            await axios.post('auth/login', data);
            history.push('/profile');
        } catch(err) {
            console.log(err);
        }
    }
    return (
        <div className='login-password-step-page'>
        <TwitterIcon className='twitter-logo' color='primary'/>
            <h1 className='password-title'>Enter your password</h1>
            <form className='password-login-form' onSubmit={handlePasswordSubmit}>
            <TextField className='input-login-password' id="standard-basic" label="Password" variant="standard" value={password} onChange={handlePasswordChange}/>
                <Divider className='divider-login-password-step' variant="middle" />
                <button type='submit' className='password-btn'>Next</button>
            </form>
        </div>
    )
}
