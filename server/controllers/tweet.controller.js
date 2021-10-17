const Tweet = require('../models/Tweet.model');
const User = require('../models/User.model');


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

        const { id, description, createdAt, likes, comments } = tweet;
        const { _id, profilePicture, name } = tweet.creator;

        const tweetData = { _id, profilePicture, name, id, description, createdAt, likes, comments };
        res.status(200).json({ tweet: tweetData });

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

