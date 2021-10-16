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

