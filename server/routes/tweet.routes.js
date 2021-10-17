const express = require('express');
const router = express.Router();
const TweetController = require('../controllers/tweet.controller');


router.get('/comments/:tweetId', TweetController.tweet_comments);

router.post('/create', TweetController.create_tweet);

router.post('/comment', TweetController.comment);



module.exports = router;