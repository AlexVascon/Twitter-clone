const Tweet = require('../models/Tweet.model');
const User = require('../models/User.model');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId()

exports.create_tweet = async (req, res) => {
    try {
        const { tweetDescription } = req.body;

        const createdTweet = await Tweet.create({ 
            creator: req.payload._id, 
            description: tweetDescription 
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
        const { tweetDescription, replyTweet } = req.body;

        const commentTweet = await Tweet.create({ 
            creator: req.payload._id, 
            description: tweetDescription 
        });

        const loggedUser = await User.findByIdAndUpdate(req.payload._id, { 
            $addToSet: { 
                tweets: commentTweet._id 
            } }, 
            { new: true }
        );

        const commentOrigin = await Tweet.findByIdAndUpdate(replyTweet.id, {
            $addToSet: {
                comments: commentTweet._id
            } },
            { new: true }
            );

        const tweetDetails = await Tweet.findById(commentTweet.id).populate('creator');

            const { id, description, createdAt, likes, comments } = tweetDetails;
            const { _id, profilePicture, name } = loggedUser;
    
            const tweetData = { _id, profilePicture, name, id, description, createdAt, likes, comments };

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
            const { id, description, createdAt, likes, comments } = tweet;
            const { _id, profilePicture, name } = tweet.creator;
            return { _id, profilePicture, name, id, description, createdAt, likes, comments };
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

        const tweet = await Tweet.findById(tweetId).populate('creator');

        if(!tweet) throw Error('id does not match existing tweet');

        const { _id, description, createdAt, likes, comments } = tweet;
        const { profilePicture, name } = tweet.creator;

        const tweetData = { _id, profilePicture, name, description, createdAt, likes, comments };
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
            const { _id, description, createdAt, likes, comments } = tweet;
            const {  profilePicture, name } = tweet.creator;
            return { _id, profilePicture, name, description, createdAt, likes, comments };
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
            const { description, createdAt, likes, comments, _id } = tweet;
            return { description, createdAt, name, profilePicture, likes, comments, _id };
        })

        res.status(200).json({ tweets: tweets});

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: `Something went wrong ${err}`});
    }
}
