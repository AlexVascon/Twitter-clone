const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    birth: {
      day: {
        type: String
      },
      month: {
        type: String
      },
      year: {
        type: String
      }
    },
    profilePicture: {
      type: String
    },
    coverPicture: {
      type: String
    },
    followers: {
      ref: 'User',
      type: [Schema.Types.ObjectId],
      default: []
    },
    following: {
      ref: 'User',
      type: [Schema.Types.ObjectId],
      default: []
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
