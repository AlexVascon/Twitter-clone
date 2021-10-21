const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');
const UploadController = require('../controllers/upload.controller');

router.post('/tweet/image', fileUploader.single('tweetImage'), UploadController.tweet_image);

module.exports = router;