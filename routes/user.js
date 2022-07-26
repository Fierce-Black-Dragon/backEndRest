const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authVerify");
//controllers for user route
const {
  signup,
  signin,
  logout,
  handleRefreshToken,

  userDashboard,
} = require("../controllers/userController");

//user routes
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/refresh").get(handleRefreshToken);
router.route("/logout").get(isLoggedIn, logout);

router.route("/profile").get(isLoggedIn, userDashboard);

module.exports = router;
