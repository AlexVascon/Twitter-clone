const express = require('express');
const router = express.Router();
const TweetController = require('../controllers/tweet.controller');
const UserController = require('../controllers/user.controller');


router.get('/comments/:tweetId/:index', TweetController.comment_limit);

router.post('/create', TweetController.create_tweet);

router.post('/comment', TweetController.comment);

router.get('/:tweetId', TweetController.tweet);

router.get('/logged/:index', TweetController.profile_tweets);

module.exports = router;