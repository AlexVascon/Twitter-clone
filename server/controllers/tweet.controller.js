const Tweet = require('../models/Tweet.model');
const User = require('../models/User.model');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId()

exports.create_tweet = async (req, res) => {
    try {
        const { tweetDescription, tweetImage } = req.body;

        const createdTweet = await Tweet.create({ 
            creator: req.payload._id, 
            description: tweetDescription,
            image: tweetImage,
        });

        await User.findByIdAndUpdate(req.payload._id, { 
            $addToSet: { 
                tweets: createdTweet._id 
            }
        });

        res.status(203).json({ tweet: createdTweet });

    } catch (err) {
        console.error(err)
        res.status(404).json({ message: `Invalid data or something went wrong ${err}`});
    }
}

exports.comment = async (req, res) => {
    try {
        const { tweetDescription, tweetImage, replyTweet } = req.body;

        const commentTweet = await Tweet.create({ 
            creator: req.payload._id, 
            description: tweetDescription,
            image: tweetImage
        });

        const loggedUser = await User.findByIdAndUpdate(req.payload._id, { 
            $addToSet: { 
                tweets: commentTweet._id 
            } }, 
            { new: true }
        );

        const commentOrigin = await Tweet.findByIdAndUpdate(replyTweet._id, {
            $addToSet: {
                comments: commentTweet._id
            } },
            { new: true }
            );

        const tweetDetails = await Tweet.findById(commentTweet.id).populate('creator');

            const { id, description, createdAt, likes, comments, image } = tweetDetails;
            const { _id, profilePicture, name } = loggedUser;
    
            const tweetData = { _id, profilePicture, name, id, description, createdAt, likes, comments, image };

        res.status(200).json({ comment: tweetData });

    } catch (err) {
        console.error(err);
    }
}

exports.tweet_comments = async (req, res) => {
    try {
        const { tweetId } = req.params;

        const checkComments = await Tweet.findById(tweetId);

        if(!checkComments.comments.length) return;

        const commentsOrigin = await Tweet.findById(tweetId)
        .populate({
            path: 'comments',
            populate: {
                path: 'creator',
                model: 'User'
            }
        });

        const extractedComments = commentsOrigin.comments.map(tweet => {
            const { id, description, createdAt, likes, comments, image } = tweet;
            const { _id, profilePicture, name } = tweet.creator;
            return { _id, profilePicture, name, id, description, createdAt, likes, comments, image };
        })

        res.status(200).json({ comments: extractedComments });

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.tweet = async (req, res) => {
    try {
        const { tweetId } = req.params;

        console.log('tweet id:', tweetId)

        const tweet = await Tweet.findById(tweetId).populate('creator');

        if(!tweet) throw Error('id does not match existing tweet');

        const { _id, description, createdAt, likes, comments, retweets, image } = tweet;
        const { profilePicture, name, id } = tweet.creator;

        const tweetData = { _id, profilePicture, name, description, createdAt, likes, comments, retweets, id, image };
        res.status(200).json({ tweet: tweetData });

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.comment_limit = async (req, res) => {
    try {
        const { tweetId, index } = req.params;

        let amount = 5;

        if(index !== '0') amount += Number(index);
        
        const commentsOrigin = await Tweet.findById(tweetId)
        .lean()
        .populate({
            path: 'comments',
            options: {
                limit: amount,
                skip: index
            },
            populate: {
                path: 'creator',
                model: 'User',
                options: {
                    limit: amount,
                    skip: index
                }
            }
        });

        const extractedComments = commentsOrigin.comments.map(tweet => {
            const { _id, description, createdAt, likes, comments, retweets, image } = tweet;
            const {  profilePicture, name } = tweet.creator;
            return { _id, profilePicture, name, description, createdAt, likes, comments, retweets, image };
        })

        res.status(200).json({ comments: extractedComments });

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.profile_tweets = async (req, res) => {
    try {

        const { index } = req.params;

        let amount = 5;
        if(index !== '0') amount += Number(index);

        const loggedUser = await User.findById(req.payload._id)
        .lean()
        .populate({
            path: 'tweets',
            options: {
                limit: amount,
                skip: index
            },
            populate: {
                path: 'creator',
                model: 'User',
                options: {
                    limit: amount,
                    skip: index
                }
            }
        })

        const tweets = loggedUser.tweets.map(tweet => {
            const { name, profilePicture } = tweet.creator;
            const { description, createdAt, likes, comments, _id, image } = tweet;
            return { description, createdAt, name, profilePicture, likes, comments, _id, image };
        })

        res.status(200).json({ tweets: tweets});

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: `Something went wrong ${err}`});
    }
}

exports.user_tweets = async (req, res) => {
    try {
        const { index, userId } = req.params;

        let amount = 5;
        if(index !== '0') amount += Number(index);

        const user = await User.findById(userId)
        .lean()
        .populate({
            path: 'tweets',
            options: {
                limit: amount,
                skip: index
            },
            populate: {
                path: 'creator',
                model: 'User',
                options: {
                    limit: amount,
                    skip: index
                }
            }
        })

        const tweets = user.tweets.map(tweet => {
            const { name, profilePicture } = tweet.creator;
            const { description, createdAt, likes, comments, _id, image } = tweet;
            return { description, createdAt, name, profilePicture, likes, comments, _id, image };
        })

        res.status(200).json({ tweets: tweets});
    } catch (err) {

    }
}

exports.retweet = async (req, res) => {
    try {
        const { tweetId } = req.body;

        const tweet = await Tweet.findByIdAndUpdate(tweetId, {
            $addToSet: { retweets: req.payload._id }
        },
        { new: true }
        );

        await User.findByIdAndUpdate(req.payload._id, {
            $addToSet: { retweets: tweet._id }
        }, 
        { new: true }
        )

        res.status(200);
       
    } catch (err) {
        console.error(err);
    }
}

exports.following_limit = async (req, res) => {
    try {

        const { index } = req.params;

        let amount = 5;
        if(index !== '0') amount += Number(index);

        const limitFive = await User.findById(req.payload._id)
        .populate({
            path: 'following',
            options: {
                limit: amount,
                skip: index
            },
            populate: {
                path: 'tweets',
                model: 'Tweet',
                options: {
                    limit: amount,
                    skip: index
                },
            }
        });

        const followingList = limitFive.following;

        if(followingList.length === 0) return res.status(400).json({ message: 'No followers yet'});

        const followingTweets = followingList.map(following => {
            const { _id, name, profilePicture } = following;
            return following.tweets.map(tweet => {
                const { description , createdAt, id, likes, comments, retweets } = tweet;
                return { _id, name, profilePicture, description, createdAt, id, likes, comments, retweets };
            })
        })
        .flat();

        res.status(200).json({ followingTweets: followingTweets});


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong ' + err});
    }
}
