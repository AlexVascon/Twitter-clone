import React from 'react'
import './createNewAccount.css'
import { useHistory } from "react-router-dom";
import TwitterIcon from '@mui/icons-material/Twitter';
import TextField from '@mui/material/TextField';
import axios from '../../service/api'

export default function CreateNewAccount(props) {

    const history = useHistory();

    const {
        name,
        email,
        day,
        month,
        year,
        password,
    } = props;

    const submitAccount = async () => {
        try {
            const birthday = { day, month, year }
            const data = { name, email, birthday, password };
            await axios.post('auth/signup', data);
            history.push('/login');
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='createAccountPage'>
             <TwitterIcon className='twitter-logo' color='primary'/>
             <h1 className='submit-title'>Create your account</h1>
             <TextField className='input-name' id="standard-basic" label="Name" variant="standard" value={name}/>
             <TextField className='input-email' id="standard-basic" label="Email address" variant="standard" value={email} />
             <TextField className='input-birthday' id="standard-basic"  variant="standard" value={day + " " + month + " " + year} />
             <button className='submit-button' onClick={() => submitAccount()}>Sign up</button>
        </div>
    )
}
