const User = require("../models/User.model");
const Tweet = require('../models/Tweet.model');


exports.profile_image_upload = async (req, res) => {
    if (!req.file) {
        next(new Error('No file uploaded!'));
        return;
    }

    try {
         await User.findByIdAndUpdate(req.payload._id, 
            { profilePicture: req.file.path }, 
            { new: true }
         );

         res.status(200).json({ secure_url: req.file.path });

    } catch (err) {
        console.error(err);
        res.status(500).json({message: `Something went wrong, error: ${err}`});
    }
}

exports.profile_cover_upload = async (req, res) => {
    if (!req.file) {
        next(new Error('No file uploaded!'));
        return;
    }

    try {
        await User.findByIdAndUpdate(req.payload._id, 
            { coverPicture: req.file.path }, 
            { new: true }
         );

         res.status(200).json({ secure_url: req.file.path});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: `Something went wrong, error: ${err}`});
    }
}

exports.profile_edit = async (req, res) => {
    try {
        const { name, bio, location, website } = req.body;

        const updateUser = await User.findByIdAndUpdate(req.payload._id, 
            {
                name: name,
                bio: bio,
                location: location,
                website: website
            },
            { new: true }
            );
        res.status(200).json({ message: 'update succesful'});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'something went wrong'});
    }
}

exports.profile_details = async (req, res) => {
    try {
        const loggedUser = await User.findById(req.payload._id).populate('tweets');

        // omit password
        const { _id, email, name, profilePicture, coverPicture, followers, following, bio, location, website, tweets } = loggedUser;
        const loggedUserDetails = { _id, email, name, profilePicture, coverPicture, followers, following, bio, location, website, tweets };

        res.status(200).json({ user: loggedUserDetails});

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: `Something went wrong ${err}`});
    }
}

exports.get_liked_tweets = async (req, res) => {
    try {
        const loggedUser = await User.findById(req.payload._id)
        .populate({
            path: 'likes', // tweet ObjectIds
            populate: {
                path: 'creator', 
                model: 'User'
            }
        })

        // omit sensitive data and only return public tweet data 
        const getLikedTweets = await loggedUser.likes.map(tweet => {
            const { _id, name, profilePicture } = tweet.creator;
            const { description, createdAt } = tweet;
            return { description, createdAt, _id, name, profilePicture };
        })

        res.status(200).json({ likedTweets: getLikedTweets });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'something went wrong ' + err });
    }
}