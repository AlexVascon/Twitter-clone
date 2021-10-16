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
    },
    {
       timestamps: true,
    }
)

const Tweet = model("Tweet", tweetSchema);

module.exports = Tweet;