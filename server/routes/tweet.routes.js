const express = require('express');
const router = express.Router();
const TweetController = require('../controllers/tweet.controller');


router.post('/create', TweetController.create_tweet);


module.exports = router;