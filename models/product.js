const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide product name"],
      trim: true,
      maxlength: [120, "Product name should not be more than 120 characters"],
    },
    price: {
      type: Number,
      required: [true, "please provide product price"],
      maxlength: [6, "Product price should not be more than 6 digits"],
    },
    description: {
      type: String,
      required: [true, "please provide product description"],
    },
    photo: {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },

    DeliveryPrice: {
      type: Number,
      default: 0,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
    },
    isSpecial: {
      type: Boolean,
      default: false,
    },
    daySpecial: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", productSchema);
