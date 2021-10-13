import React, { useState, useContext } from 'react';
import './profilePage.css';
import Avatar from '@mui/material/Avatar';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { AuthContext } from '../../context/auth.context';

export default function ProfilePage() {

    const { user } = useContext(AuthContext);
    const [value, setValue] = useState('1');
    console.log('user:', user)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <div className='profile-header'>
                <div className='profile-header-container'>
                    <h1>{user?.name}</h1>
                    <p><span>0</span> Tweets</p>
                </div>
            </div>
            <section className='backdrop-container'>
            <p>Image goes here</p>
            </section>
            <section className='profile-data-top'>
                <div className='avatar-container'>
                    <Avatar sx={{ width: 100, height: 100 }} />
                    <h1>{user.name}</h1>
                    <p>Joined October 2021</p>
                    <p><span>0</span> Following <span>0</span> Followers </p>
                 </div>
                 <button className='setup-profile-btn'>Set up profile</button>
            </section>
            <section className='profile-tabs'>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                 <TabList onChange={handleChange} aria-label="lab API tabs example">
                 <Tab label="Tweets" value="1" />
                 <Tab label="Tweets and replies" value="2" />
                 <Tab label="Media" value="3" />
                 <Tab label="Likes" value="4" />
                </TabList>
            </Box>
             <TabPanel value="1">Item One</TabPanel>
             <TabPanel value="2">Item Two</TabPanel>
             <TabPanel value="3">Item Three</TabPanel>
             <TabPanel value="4">Item Four</TabPanel>
                </TabContext>
            </Box>
            </section>
        </div>
    )
}
