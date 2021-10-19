const express = require("express");
const router = express.Router();
const ProfileController = require('../controllers/profile.controller');
const fileUploader = require('../config/cloudinary.config');


router.post('/setup/upload/profilePicture', fileUploader.single('profilePicture'), ProfileController.profile_image_upload);

router.post('/setup/upload/coverPicture', fileUploader.single('coverPicture'), ProfileController.profile_cover_upload);

router.get('/liked/tweets', ProfileController.get_liked_tweets);

router.post('/edit', ProfileController.profile_edit);

router.get('/details', ProfileController.profile_details);




module.exports = router;