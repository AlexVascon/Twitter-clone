const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');
const AuthController = require('../controllers/auth.controller');


// send email verification token
router.post('/setup', AuthController.setup);

router.post('/signup', AuthController.signup);

router.post('/user/check-exist', AuthController.user_check_exists);

router.post('/login', AuthController.login);

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req, res, next) => {      
 
    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log(`req.payload`, req.payload);
   
    // Send back the object with user data
    // previously set as the token payload
    res.status(200).json(req.payload);
});


module.exports = router;