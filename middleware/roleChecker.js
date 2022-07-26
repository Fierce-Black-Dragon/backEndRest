exports.customRoleChecker = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw createError.Unauthorized("You are not allowed for this resource");
    }
    next();
  };
};
