const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authVerify");
const { customRoleChecker } = require("../middleware/roleChecker");
const {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProductByID,
  deleteProductByID,
} = require("../controllers/menuItemController");

//user routes
router.route("/").get(fetchAllProducts);
router.route("/:id").get(fetchProductById);

////Admin

// product protected routes
router
  .route("/create")
  .post(isLoggedIn, customRoleChecker(process.env.ADMIN), createProduct);

router
  .route("/:id")
  .patch(isLoggedIn, customRoleChecker(process.env.ADMIN), updateProductByID)
  .delete(isLoggedIn, customRoleChecker(process.env.ADMIN), deleteProductByID);

module.exports = router;
