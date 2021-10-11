const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const router = express.Router();
const saltRounds = 10;
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');
const sendConfirmationEmail = require('../config/nodemailer.config');


// create account step 1 
router.post('/setup', async (req, res) => {
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
          }

        // const createdUser = await User.create({ 
        //     email: email, 
        //     name: name,
        //     confirmationCode: emailToken,
        //     birthday: {
        //         day: birthday.day,
        //         month: birthday.month,
        //         year: birthday.year
        //     },
        //     password: 'T3empP@ssword'
        // });

        sendConfirmationEmail(
            name,
            email,
            emailToken
        )

        res.status(203).json({ emailToken: emailToken });
    } catch (err) {
        res.status(400).json(err)
    }
})

// create account step 2
router.post('/confirm-email', async(req,res) => {
    try {
        const { code } = req.body
        const user = await User.findOne({ confirmationCode: req.body.code })
        if(!user) {
            res.status(404).json({ message: 'user not found'})
            return;
        }

         // Create a new object that doesn't expose the password
        const sendUser = { 
            email: user.email, 
            name: user.name,
            _id: user._id
        };

        res.status(200).json(sendUser)

    } catch (err) {

    }
} )

// create account step 3
router.post('/password', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.find({ email });

        if(!user) {
            res.status(404).json({ message: 'user not found '})
            return;
        }

        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return;
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);


        const confirmNewUser = await User.findByIdAndUpdate(user[0]._id, 
            { password: hashedPassword },
            { confirmed: true},
            { new: true }
            )
        // Create a new object that doesn't expose the password
            const sendUser = { 
            email: confirmNewUser.email, 
            name: confirmNewUser.name,
            _id: confirmNewUser._id
        };

        res.status(201).json({ user: sendUser });

    } catch (err) {

    }
})

router.post('/signup', async (req, res, next) => {
    try {

        const { email, password, firstName, lastName } = req.body;

        // Check if email or password or firstName or lastName are provided as empty string 
        if (email === '' || password === '' || firstName === '' || lastName === '') {
        res.status(400).json({ message: "Provide email, password, first name and last name" });
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

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // email verify token process
        const characters =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
          let emailToken = "";

          for (let i = 0; i < 5; i++) {
            emailToken +=
              characters[Math.floor(Math.random() * characters.length)];
          }
   
        const createdUser = await User.create({ 
            email: email, 
            password: hashedPassword, 
            firstName: firstName, 
            lastName: lastName,
            confirmationCode: emailToken,
        });

        sendConfirmationEmail(
            createdUser.firstName,
            createdUser.email,
            createdUser.confirmationCode
        )
      
        // Create a new object that doesn't expose the password
        const user = { 
            email: createdUser.email, 
            firstName: createdUser.firstName, 
            lastName: createdUser.lastName,
            _id: createdUser._id
        };

        res.status(201).json({ user: user });
  
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
   
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Check if email or password are provided as empty string 
        if (email === '' || password === '') {
        res.status(400).json({ message: "Provide email and password." });
        return;
        }

        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            // If the user is not found, send an error response
            res.status(401).json({ message: "User not found." })
            return;
        }

        if(!foundUser.confirmed) {
            res.status(401).json({ message: 'Please check emails to confirm account.'})
            return;
        }

         // Compare the provided password with the one saved in the database
         const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
   
         if (passwordCorrect) {
           // Deconstruct the user object to omit the password
           const { _id, email, name } = foundUser;
           
           // Create an object that will be set as the token payload
           const payload = { _id, email, name };
    
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
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }

});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req, res, next) => {      
 
    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log(`req.payload`, req.payload);
   
    // Send back the object with user data
    // previously set as the token payload
    res.status(200).json(req.payload);
});

router.post('/confirmation', async (req,res) => {
    try {
        const user = await User.findOne({
            confirmationCode: req.body.token
        })

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        user.confirmed = true;
        user.save((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          return res
            .status(200)
            .json({ message: "Email authenticated. Login" });
        });
        

    } catch (err) {
        res.send('error');
    }
})



module.exports = router;