const { Long } = require("mongodb");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  shortUUID: {
    type: String,
    required: true,
  },
  palette: [
    {
      type: String,
    },
  ],
  likesInfo: {
    count: {
      type: Number,
      default: 0,
    },
    users: [
      {
        type: String,
      },
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
