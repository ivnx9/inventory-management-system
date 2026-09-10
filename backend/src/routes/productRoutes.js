const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getProducts);

router.get("/:id", authenticateToken, getProductById);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createProduct
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateProduct
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteProduct
);

module.exports = router;