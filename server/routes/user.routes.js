const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.get('/following/tweets', UserController.following_tweets);

router.post('/like/tweet', UserController.like_tweet);

router.get('/all/non/following', UserController.get_follow_options);

router.post('/follow', UserController.follow_user);

router.get('/all', UserController.get_all_users);







module.exports = router;