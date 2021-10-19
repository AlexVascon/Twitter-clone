import React, { useState, useEffect } from 'react';
import './profileEdit.css';
import { Avatar } from '@mui/material';
import authAxios from '../../service/authApi';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useHistory } from 'react-router-dom';


export default function ProfileEditPage() {

    const history = useHistory();

    const [coverPicture, setCoverPicture] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [name, setName] = useState('');
    const [bio, SetBio] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');

    const handleName = e => setName(e.target.value);
    const handleBio = e => SetBio(e.target.value);
    const handleLocation = e => setLocation(e.target.value);
    const handleWebsite = e => setWebsite(e.target.value);

    const Input = styled('input')({
        display: 'none',
      });
    
    const handleBackdropUpload = async (e) => {
        e.preventDefault();

        try {
            const uploadData = new FormData();
            uploadData.append('coverPicture', e.target.files[0]);

            const coverPictureData = await authAxios.post('profile/setup/upload/coverPicture', uploadData);
            setCoverPicture(coverPictureData?.data?.secure_url);

        } catch (err) {
            console.error(err);
        }
        
    }

    const handleUpload = async (e) => {
        e.preventDefault();

        try {
            const uploadData = new FormData();
            uploadData.append('profilePicture', e.target.files[0]);

            const profilePictureData = await authAxios.post('profile/setup/upload/profilePicture', uploadData);
            setProfilePicture(profilePictureData?.data?.secure_url);

        } catch (err) {
            console.error(err);
        }
        
    }

    const onClickSaveChanges = async () => {
        try {
            const updateUserData = { name, bio, location, website, profilePicture, coverPicture }
            await authAxios.post('profile/edit', updateUserData);

            history.push('/profile');

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const getLoggedDetails = async () => {
            try {
                const loggedUserDetails = await authAxios.get('profile/details');

                setName(loggedUserDetails?.data?.user?.name);
                SetBio(loggedUserDetails?.data?.user?.bio);
                setLocation(loggedUserDetails?.data?.user?.location);
                setWebsite(loggedUserDetails?.data?.user?.website);
                setProfilePicture(loggedUserDetails?.data?.user?.profilePicture);
                setCoverPicture(loggedUserDetails?.data?.user?.coverPicture);

            } catch (err) {
                console.error(err);
            }
        }
        getLoggedDetails();
    }, [])

    return (
       <>
        <div className='edit-profile-header'>
        <Link className='edit-profile-back-arrow' to='/profile'>
        <ArrowBackIcon color="primary" />
        </Link>
            <h4 className='edit-profile-title'>Edit profile</h4>
            <button onClick={() => onClickSaveChanges()} className='edit-profile-save-btn'>Save</button>
        </div>
        <div className='backdrop-upload-image-container' style={{ backgroundImage: `url(${coverPicture})`}}>
        <label className='' htmlFor="icon-button-file">
        <Input accept="image/*" id="icon-button-file" type="file" onChange={handleBackdropUpload}/>
            <IconButton aria-label="upload picture" component="span">
                <PhotoCamera />
            </IconButton>
        </label>
        </div>
        <div className='profile-image-upload-container'>
        <div className='profile-image' style={{ backgroundImage: `url(${profilePicture})`}}>
        <label className='test' htmlFor="icon-button-profile">
            <Input accept="image/*" id="icon-button-profile" type="file" onChange={handleUpload}/>
            <IconButton aria-label="upload picture" component="span">
                <PhotoCamera />
            </IconButton>
           </label>
        </div>
           {/* <Avatar className='profile-image' src={profilePicture} sx={{ width: 80, height: 80 }}>
           <label className='test' htmlFor="icon-button-profile">
            <Input accept="image/*" id="icon-button-profile" type="file" onChange={handleUpload}/>
            <IconButton aria-label="upload picture" component="span">
                <PhotoCamera />
            </IconButton>
           </label>
           </Avatar> */}
        </div>
        <div className='multi-text-form'>
        <TextField
          fullWidth
          id="outlined"
          label="Name"
          value={name}
          margin="dense"
          onChange={handleName}
        />
         <TextField
          id="outlined-multiline-static"
          label="Bio"
          multiline
          rows={3}
          value={bio}
          margin="dense"
          onChange={handleBio}
        />
        <TextField
          fullWidth
          id="outlined"
          label="Location"
          value={location}
          margin="dense"
          onChange={handleLocation}
        />
        <TextField
          fullWidth
          id="outlined"
          label="Website"
          value={website}
          margin="dense"
          onChange={handleWebsite}
        />
        </div> 
        </>
    )
}
