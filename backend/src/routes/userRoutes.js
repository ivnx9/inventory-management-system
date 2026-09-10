const express = require("express");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  changeMyPassword,
} = require("../controllers/userController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin user management
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getUsers
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createUser
);

// Logged-in user changes their own password
// IMPORTANT: This must come before /:id/password
router.put(
  "/me/password",
  authenticateToken,
  changeMyPassword
);

// Admin updates a user's information
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateUser
);

// Admin resets another user's password
router.put(
  "/:id/password",
  authenticateToken,
  authorizeRoles("admin"),
  resetUserPassword
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = router;