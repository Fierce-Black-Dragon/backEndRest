const UserModel = require("../models/userModel");

const cookieToken = require("../utils/CookieToken");

const jsonwebtoken = require("jsonwebtoken");
const createError = require("http-errors");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, mobile } = req.body;

    //finding if user is already register
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      throw createError.Conflict(
        `${existingUser.email} is already been registered`
      );
    }
    //creating user in mongo db
    const user = await UserModel.create({
      name,
      email,
      password,
      mobile,
    });
    //jwt  accessToken creation
    const accessToken = await user.jwtAccessTokenCreation();
    // jwt  refresh token creation
    const refreshToken = await user.jwtRefreshTokenGeneration();
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    };

    //cookie creations
    // Saving refreshToken with current user
    user.refreshToken = refreshToken;
    const result = await user.save();
    // res.cookie("jwt", refreshToken, options);
    res.cookie("jwt", refreshToken, options).status(200).json({
      success: true,
      accessToken,
      name: user.name,
      role: user.role,
    });
    // send json response with register successfully
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    //validate the  user input (checking if all fields are enter correctly)

    const { email, password } = req.body;

    if (!(email && password)) {
      throw createError.NotFound("details missing");
    }

    //finding the user in database  using email
    const user = await UserModel.findOne({ email }).select("+password");

    //if user is not found
    if (!user) {
      throw createError.NotFound("User not found");
    }
    // checking  if enter password is correct
    const isPAsswordCorrect = await user.isPasswordValid(password);
    if (!isPAsswordCorrect) {
      throw createError.Unauthorized("email or password invalid");
    }

    //token creation function
    cookieToken(user, res);
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 400;
      error.message = "email or password invalid";
    }
    next(error);
  }
};

// log out user
exports.logout = async (req, res, next) => {
  try {
    //deleting refresh token from redisDB
    const token = req.cookies.token;

    //making the cookie expiry  options
    const options = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };

    //setting cookie to null when logout route is requested
    res.status(200).cookie("token", null, options).json({
      success: true,
      message: "logout success",
    });
  } catch (error) {
    next(error);
  }
};
exports.userDashboard = async (req, res, next) => {
  try {
    //req.user is injected through middleware
    const user = req?.user;
    // if user is missing
    if (!user) {
      throw createError.Unauthorized;
    }
    //if user
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await UserModel.findOne({ refreshToken }).exec();
    if (!foundUser) {
      throw createError.NotFound("User not found");
    }

    // evaluate jwt
    jsonwebtoken.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
          throw createError.Unauthorized("User unauthorized");
      }
    );
    const accessToken = await foundUser.jwtAccessTokenCreation();

    //cookie creations

    // res.cookie("jwt", refreshToken, options);

    res.status(200).json({
      success: true,
      accessToken,
      name: foundUser?.name,
      role: foundUser?.role,
    });
  } catch (error) {
    next(error);
  }
};
