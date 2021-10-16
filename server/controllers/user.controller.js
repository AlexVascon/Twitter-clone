const User = require('../models/User.model');
const Tweet = require('../models/Tweet.model');


exports.get_follow_options = async (req, res) => {
    try {
        const loggedUser = await User.findById(req.payload._id);

        const listOfAllUsers = await User.find();

        const filterNotAlreadyFollowing = listOfAllUsers.filter(user => {
            return (user.id !== loggedUser.id) && !loggedUser.following.includes(user._id);
        });

        res.status(200).json({ usersList: filterNotAlreadyFollowing });

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.get_all_users = async (req, res) => {
    try {
        const users = await User.find().populate('tweets');

        const omitSensitiveUserData = users.map(user => {
            const { _id, name, bio, tweets, profilePicture } = user;
            return { _id, name, bio, tweets, profilePicture };
        })

        res.status(200).json({ users: omitSensitiveUserData });

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.follow_user = async (req, res) => {
    try {
        const { userId } = req.body;
        const foundUser = await User.findById(userId);

        if(!foundUser) return res.status(404).json({ message: 'invalid user, does not exist'});

        const loggedUser = await User.findById(req.payload._id);
        const followStatus = loggedUser.following.includes(userId);

        if(followStatus) return res.status(400).json({ message: 'already following user'})

        await User.findByIdAndUpdate(req.payload._id, {
            $addToSet: { following: userId }
        });
        await User.findByIdAndUpdate(userId, {
            $addToSet: { followers: req.payload._id }
        }, 
        { new: true} );

        res.status(200).json({ message: 'follow request sent'});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong ' + err});
    }
}

exports.following_tweets = async (req, res) => {
    try {
        const loggedUser = await User.findById(req.payload._id)
        .populate({
            path: 'following',
            populate: {
                path: 'tweets',
                model: 'Tweet',
            }
        });
        const followingList = loggedUser.following;

        if(!followingList.length) return res.status(400).json({ message: 'No followers yet'});

        const followingTweets = followingList.map(following => {
            const { _id, name, profilePicture } = following;

            return following.tweets.map(tweet => {
                const { description , createdAt } = tweet;
                return { _id, name, profilePicture, description, createdAt };
            })
        })
        .flat();

        res.status(200).json({ followingTweets: followingTweets});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong ' + err});
    }
}

exports.like_tweet = async (req, res) => {
    try {
        const { tweetId } = req.body;

        const loggedUser = await User.findById(req.payload._id);

        if(!loggedUser) throw new Error('logged user not found. Sign in again or try again later');

        const checkLiked = await Tweet.findById(tweetId);

        if(loggedUser.likes.includes(checkLiked._id)){
            await User.findByIdAndUpdate(req.payload._id, {
                $pull: { likes: checkLiked._id } },
                { new: true }
            );
            res.status(200).json({ message: 'removed like'});
            return;
        }

        await User.findByIdAndUpdate(req.payload._id, {
            $addToSet: { likes: checkLiked._id } }, 
            { new: true }
            )

        res.status(200).json({ message: 'liked post succesfully'});
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong ' + err})
    }
}