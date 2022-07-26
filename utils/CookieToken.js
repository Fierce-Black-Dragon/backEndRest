const createError = require("http-errors");

const cookieToken = async (user, res) => {
  //jwt  accessToken creation
  const accessToken = await user.jwtAccessTokenCreation();
  // jwt  refresh token creation
  const refreshToken = await user.jwtRefreshTokenGeneration();
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  };

  user.password = undefined;
  //cookie creations
  // res.cookie("jwt", refreshToken, options);
  res.cookie("jwt", refreshToken, options).status(200).json({
    success: true,
    accessToken,
    name: user.name,
    role: user.role,
  });
};
module.exports = cookieToken;
