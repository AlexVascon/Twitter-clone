const User = require("../models/User.model");

exports.tweet_image = async (req, res) => {
    if (!req.file) {
        next(new Error('No file uploaded!'));
        return;
    }
    try {
        
        res.status(200).json({ secure_url: req.file.path });
        
    } catch(err) {
        console.error(err);
    }
}