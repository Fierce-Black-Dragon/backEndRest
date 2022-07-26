const Review = require("../models/review");
const UserModel = require("../models/userModel");
const product = require("../models/product");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
// email,mobile,name,rating,comment,
exports.addReview = async (req, res, next) => {
  try {
    // getting the require data from req.body
    const { email, mobile, name, rating, comment } = req.body;
    const token =
      req.cookies.jwt || req.header("Authorization")?.replace("Bearer ", "");
    let user;

    if (!(email || mobile)) {
      throw createError.BadRequest(
        " enter email or mobile no to  write a review a review"
      );
    }

    if (!(name || (rating && comment))) {
      throw createError.BadRequest("all fields  are required");
    }
    const review = await Review.create({
      name: name ? name : mobile ? mobile : email ? email : user?.name,
      email: email ? email : user?.email,
      mobile: mobile ? mobile : 000000000,
      user: user?._id,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
};
exports.editReview = async (req, res, next) => {
  try {
    // getting the require data from req.body

    const review = await Review.findById(req?.params?.id);

    if (
      !(
        review?.user === req?.user?._id ||
        review?.email === req?.user?.email ||
        review?.mobile === req?.user?.mobile
      )
    ) {
      throw createError.BadRequest(" your not authorized");
    }
    const result = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(201).json({
      success: true,
      message: " Review updated successfully ",
    });
  } catch (error) {
    next(error);
  }
};
exports.fetchReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    // getting the require data from req.body

    const review = await Review.findById(req?.params?.id);

    if (
      !(
        review?.user === req?.user?._id ||
        review?.email === req?.user?.email ||
        review?.mobile === req?.user?.mobile
      )
    ) {
      throw createError.BadRequest(" your not authorized");
    }
    const result = await Review.findByIdAndRemove(req?.params?.id);
    res.status(201).json({
      success: true,
      message: " Review deleted successfully ",
    });
  } catch (error) {
    next(error);
  }
};
