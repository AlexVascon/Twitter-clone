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

        await User.findByIdAndUpdate(req.payload._id, { 
            $addToSet: { 
                tweets: commentTweet._id 
            }
        });

        const commentOrigin = await Tweet.findByIdAndUpdate(replyTweet.id, {
            $addToSet: {
                comments: commentTweet._id
            } },
            { new: true }
            );

        res.status(200).json({ comment: commentTweet });

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

        console.log('comment origin:', commentsOrigin);

        const extractedComments = commentsOrigin.comments.map(tweet => {
            const { id, description, createdAt } = tweet;
            const { _id, profilePicture, name } = tweet.creator;
            return { _id, profilePicture, name, id, description, createdAt }
        })

        res.status(200).json({ comments: extractedComments });

    } catch (err) {

    }
}

