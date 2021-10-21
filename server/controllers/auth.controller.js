const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const router = express.Router();
const saltRounds = 10;
const sendConfirmationEmail = require('../config/nodemailer.config');


exports.setup = async (req, res) => {
    try {
        const { email, name } = req.body;

        if (email === '' || name === '') {
            res.status(400).json({ message: "Provide email and name" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Provide a valid email address.' });
        return;
        }

        const foundUser = await User.find({ email });

        if (foundUser[0]) {
            res.status(400).json({ message: "User already exists." });
            return;
        } 

        const characters =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
          let emailToken = "";

          for (let i = 0; i < 5; i++) {
            emailToken +=
              characters[Math.floor(Math.random() * characters.length)];
          };

        sendConfirmationEmail(
            name,
            email,
            emailToken
        );

        res.status(203).json({ emailToken: emailToken });

    } catch (err) {
        console.error(`setup route: ${err}`);
        res.status(500).json({ message: `Something went wrong ${err}`});
    }
};

exports.signup = async (req, res, next) => {
    try {
        const { email, password, name, birthday } = req.body;

        if (email === '' || password === '' || name === '') {
        res.status(400).json({ message: "Provide email, password, name" });
        return;
        }

        // Use regex to validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Provide a valid email address.' });
        return;
        }

        // Use regex to validate the password format
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return;
        }

        const foundUser = await User.find({ email });

        if (foundUser[0]) {
            res.status(400).json({ message: "User already exists." });
            return;
        } 

        // secure password using bcrypt
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const createdUser = await User.create({ 
            email: email, 
            name: name,
            password: hashedPassword, //save encrypted password
            birthday: {
                day: birthday.day,
                month: birthday.month,
                year: birthday.year
            },
        });

        res.status(201).json({ message: 'Account succesfully created' });
  
    } catch (err) {
        console.error(`signup route: ${err}`);
        res.status(500).json({ message: "Internal Server Error" })
    }
   
};

exports.user_check_exists = async (req, res) => {
    try {
        const { inputChoice } = req.body
        const foundUser = await User.findOne({ email: inputChoice });

        if(foundUser.email === inputChoice || foundUser.name === inputChoice) {
            res.status(200).json({ message: 'found user '});
            return;
        }

        res.status(404).json({ message: 'invalid credentials'});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'internal server error'});
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (email === '' || password === '') {
        res.status(400).json({ message: "Provide email and password." });
        return;
        }

        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            res.status(401).json({ message: "User not found." })
            return;
        }

         // Compare the provided password with the one saved in the database
         const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
         
         if (passwordCorrect) {
           // Deconstruct the user object to omit the password
           const { _id, email, name, profilePicture, coverPicture, followers, following, bio, location, website } = foundUser;
           
           // Create an object that will be set as the token payload
           const payload = { _id, email, name, profilePicture, coverPicture, followers, following, bio, location, website };
    
           // Create and sign the token
           const authToken = jwt.sign( 
             payload,
             process.env.TOKEN_SECRET,
             { algorithm: 'HS256', expiresIn: "6h" }
           );

           
    
           // Send the token as the response
           res.status(200).json({ authToken: authToken });

         } else {
            res.status(401).json({ message: "Unable to authenticate the user" });
        }
  
    } catch (err) {
        console.error(`login route ${err}`);
        res.status(500).json({ message: "Internal Server Error" });
    }

}