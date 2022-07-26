const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const createError = require("http-errors");

exports.isLoggedIn = async (req, res, next) => {
  try {
    // storing token from  req header

    const token = req.header("Authorization")?.replace("Bearer ", "");

    // if token is not present
    if (!token) {
      return next(createError[403]);
    }
    //verifying access token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_KEY,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //invalid token
        
        req.user = await User.findById(decoded.id);

        next();
      }
    );
    //injecting user information in req
  } catch (error) {
    next(error);
  }
};
