const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authVerify");
const { customRoleChecker } = require("../middleware/roleChecker");
const {
  editReview,
  addReview,
  deleteReview,
  fetchReviews,
  fetchReviewById,
} = require("../controllers/reviewController");

// //user routes
router.route("/").get(fetchReviews);
router.route("/:id").get(fetchReviewById);

////Admin

// product protected routes
router.route("/create").post(addReview);

router
  .route("/:id")
  .patch(isLoggedIn, editReview)
  .delete(isLoggedIn, deleteReview);

module.exports = router;
