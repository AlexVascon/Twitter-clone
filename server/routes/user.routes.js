const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.get('/following/tweets/limit/five', UserController.following_limit);

router.get('/following/tweets', UserController.following_tweets);

router.get('/non/following/limit/three', UserController.users_limit);

router.post('/like/tweet', UserController.like_tweet);

router.get('/all/non/following', UserController.get_follow_options);

router.post('/follow', UserController.follow_user);

router.get('/all', UserController.get_all_users);

router.get('/visit/details/:userId', UserController.user_details);







module.exports = router;