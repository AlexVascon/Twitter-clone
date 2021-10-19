const User = require('../models/User.model');
const Tweet = require('../models/Tweet.model');


exports.get_follow_options = async (req, res) => {
    try {
        const loggedUser = await User.findById(req.payload._id);

        const listOfAllUsers = await User.find();
        
        const filterNotAlreadyFollowing = listOfAllUsers.filter(user => {
            return (user.id !== loggedUser.id) && !loggedUser.following.includes(user.id);
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
                const { description , createdAt, id, likes, comments } = tweet;
                return { _id, name, profilePicture, description, createdAt, id, likes, comments };
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

        const checkLiked = await Tweet.findById(tweetId).populate('creator');

        if(loggedUser.likes.includes(checkLiked.id)){
            await User.findByIdAndUpdate(req.payload._id, {
                $pull: { likes: checkLiked.id } },
                { new: true }
            );
            await Tweet.findByIdAndUpdate(checkLiked.id, {
                $pull: { likes: loggedUser.id } },
                { new: true }
                )
            res.status(200).json({ message: 'removed like'});
            return;
        }

        await User.findByIdAndUpdate(req.payload._id, {
            $addToSet: { likes: checkLiked.id } }, 
            { new: true }
            )

        await Tweet.findByIdAndUpdate(checkLiked.id, {
            $addToSet: { likes: loggedUser.id } },
            { new: true }
            )

            const { likes } = checkLiked;

            res.status(200).json({ likes: likes });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong ' + err})
    }
}

exports.users_limit = async (req, res) => {
    try {
        const limitThree = await User.find().limit(4);

        const loggedUser = await User.findById(req.payload._id);

        const filterLoggedUser = limitThree.filter(user => {
            return (user.id !== req.payload._id) && !loggedUser.following.includes(user._id);
        })

    } catch (err) {
        console.error(err)
        res.status(500).json(err);
    }
}

exports.following_limit = async (req, res) => {
    try {
        const limitFive = await User.findById(req.payload._id)
        .populate({
            path: 'following',
            options: {
                limit: 5,
            },
            populate: {
                path: 'tweets',
                model: 'Tweet',
                options: {
                    limit: 5,
                },
            }
        });

        const followingList = limitFive.following;

        if(!followingList.length) return res.status(400).json({ message: 'No followers yet'});

        const followingTweets = followingList.map(following => {
            const { _id, name, profilePicture } = following;

            return following.tweets.map(tweet => {
                const { description , createdAt, id, likes, comments } = tweet;
                return { _id, name, profilePicture, description, createdAt, id, likes, comments };
            })
        })
        .flat();

        res.status(200).json({ followingTweets: followingTweets});


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong ' + err});
    }
}