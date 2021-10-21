const express = require("express");
const router = express.Router();
const FollowController = require('../controllers/follow.controller');

router.get('/status/:userId', FollowController.follow_status);

router.post('/isfollowing', FollowController.is_following);

module.exports = router;
