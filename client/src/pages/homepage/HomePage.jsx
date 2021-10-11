import React from 'react'
import './homePage.css'
import { Link } from "react-router-dom";
import TwitterIcon from '@mui/icons-material/Twitter';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: { delay: .5, duration: 1.5 }
    },
    exit: {
        x: '-100vw',
        transition: { ease: 'easeInOut' }
    }
}

export default function HomePage() {
    return (
        <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        exist='exist'
        >
        <div className='home-screen'>
        <TwitterIcon className='twitter-logo' color='primary'/>
             <h1 className='opening-text'>See what's happening in the world right now.</h1>

             <button className='blue-button'>
             <Link className='button-link' to={'/signup'}>
             Create account
             </Link>
             </button>
             <p className='bottom-link'>
             Have an account already?
                <Link to={"/login"}> Log in</Link>
             </p>
        </div>
        </motion.div>
    )
}
