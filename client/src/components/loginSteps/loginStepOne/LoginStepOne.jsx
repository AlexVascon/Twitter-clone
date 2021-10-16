import React, { useState} from 'react';
import './loginStepOne.css';
import TwitterIcon from '@mui/icons-material/Twitter';
import TextField from '@mui/material/TextField';
import axios from '../../../service/api'
import Divider from '@mui/material/Divider';


export default function LoginStepOne(props) {

    const { 
        nextStep,
        setEmail 
    } = props;

    const [inputChoice, setInputChoice] = useState('');
    const [errorMessage, setErrorMessage] = useState(undefined);

    const handleInputChange = e => setInputChoice(e.target.value);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = { inputChoice };
            await axios.post('auth/user/check-exist', data);

            setEmail(data?.inputChoice);

            nextStep();

        } catch (err) {
            console.warn(err);
            setErrorMessage(err.response.data.message)
        }
    }

    return (
        <div>
            <TwitterIcon className='twitter-logo' color='primary'/>
            <h1 className='login-title'>To get started, first enter your phone, email address or @username</h1>
            <form className='login-form' onSubmit={handleLoginSubmit}>
            <TextField className='login-choice' id="standard-basic" label="Phone, email address or username" variant="standard" value={inputChoice} onChange={handleInputChange}/>
            <Divider className='divider-login' variant="middle" />
            <button className='login-submit' type='submit'>Next</button>
            </form>
            { errorMessage && <p className="error-message">{errorMessage}</p> }
        </div>
    )
}
