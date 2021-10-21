const User = require("../models/User.model");

exports.follow_status = async (req, res) => {
    try {
        const { userId } = req.params;

        const loggedUser = await User.findById(req.payload._id);

        const followStatus = loggedUser.following.includes(userId);

        console.log('status:', followStatus);

        res.status(200).json({status: followStatus});
    } catch (err) {
        console.error(err)  
    }
}

exports.is_following = async (req, res) => {
    try {
        const { userId } = req.body;

        const loggedUser = await User.findById(req.payload._id);

        const followStatus = loggedUser.following.includes(userId);

        if(followStatus) {
            await User.findByIdAndUpdate(req.payload._id, {
                $pull: { following: userId}
            },
            { new: true }
            )

            await User.findByIdAndUpdate(userId, {
                $pull: { followers: req.payload._id}
            }, 
            { new: true }
            )
        } else {
            await User.findByIdAndUpdate(req.payload._id, {
                $addToSet: { following: userId}
            },
            { new: true }
            )

            await User.findByIdAndUpdate(userId, {
                $addToSet: { followers: req.payload._id}
            }, 
            { new: true }
            )
        }

        const updatedLoggedUser = await User.findById(req.payload._id);

        const newFollowStatus = updatedLoggedUser.following.includes(userId);

        res.status(200).json({status: newFollowStatus });
    } catch (err) {
        console.error(err);
    }
}