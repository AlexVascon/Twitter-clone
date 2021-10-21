const express = require('express');
const router = express.Router();
const TweetController = require('../controllers/tweet.controller');


router.get('/comments/:tweetId/:index', TweetController.comment_limit);

router.post('/create', TweetController.create_tweet);

router.post('/comment', TweetController.comment);

router.get('/:tweetId', TweetController.tweet);

router.get('/logged/:index', TweetController.profile_tweets);

router.get('/visit/:index/:userId', TweetController.user_tweets);

router.post('/retweet', TweetController.retweet);

router.get('/following/:index', TweetController.following_limit);

module.exports = router;