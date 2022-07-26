const mongoose = require("mongoose");

//review schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    email: {
      type: String,
    },
    mobile: {
      type: Number,

      min: 0000000000,
      max: 9999999999,
    },
    name: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
