const { Schema, model } = require("mongoose");


const tweetSchema = new Schema(
    {
        creator: {
            ref: 'User',
            type: Schema.Types.ObjectId,
            default: []
        },
        description: {
             type: String
         },
         comments: {
             ref: 'Tweet',
             type: [Schema.Types.ObjectId],
             default: []
         },
         likes: {
             type: [String],
             default: [],
         },
    },
    {
       timestamps: true,
    }
)

const Tweet = model("Tweet", tweetSchema);

module.exports = Tweet;