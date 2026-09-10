const { getPool, sql } = require("../config/db");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT
        id,
        username,
        role,
        created_at
      FROM Users
      ORDER BY id DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error retrieving users:", error.message);

    res.status(500).json({
      message: "Failed to retrieve users.",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        message: "Username, password, and role are required.",
      });
    }

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        message: "Role must be admin or user.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const pool = getPool();

    const result = await pool
      .request()
      .input("username", sql.NVarChar(50), username)
      .input("password_hash", sql.NVarChar(255), passwordHash)
      .input("role", sql.NVarChar(20), role)
      .query(`
        INSERT INTO Users
          (username, password_hash, role)
        OUTPUT
          INSERTED.id,
          INSERTED.username,
          INSERTED.role,
          INSERTED.created_at
        VALUES
          (@username, @password_hash, @role)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error("Error creating user:", error.message);

    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        message: "Username already exists.",
      });
    }

    res.status(500).json({
      message: "Failed to create user.",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;

    if (!username || !role) {
      return res.status(400).json({
        message: "Username and role are required.",
      });
    }

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        message: "Role must be admin or user.",
      });
    }

    const pool = getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("username", sql.NVarChar(50), username)
      .input("role", sql.NVarChar(20), role)
      .query(`
        UPDATE Users
        SET
          username = @username,
          role = @role
        WHERE id = @id;

        SELECT
          id,
          username,
          role,
          created_at
        FROM Users
        WHERE id = @id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error updating user:", error.message);

    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        message: "Username already exists.",
      });
    }

    res.status(500).json({
      message: "Failed to update user.",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete your own account.",
      });
    }

    const pool = getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM Users
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);

    res.status(500).json({
      message: "Failed to delete user.",
    });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "New password is required.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const pool = getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("password_hash", sql.NVarChar(255), passwordHash)
      .query(`
        UPDATE Users
        SET password_hash = @password_hash
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message: "User password updated successfully.",
    });
  } catch (error) {
    console.error("Error resetting password:", error.message);

    res.status(500).json({
      message: "Failed to update user password.",
    });
  }
};

const changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
      });
    }

    const pool = getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, req.user.id)
      .query(`
        SELECT password_hash
        FROM Users
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const user = result.recordset[0];

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    const newPasswordHash = await bcrypt.hash(
      newPassword,
      10
    );

    await pool
      .request()
      .input("id", sql.Int, req.user.id)
      .input(
        "password_hash",
        sql.NVarChar(255),
        newPasswordHash
      )
      .query(`
        UPDATE Users
        SET password_hash = @password_hash
        WHERE id = @id
      `);

    res.json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error changing password:", error.message);

    res.status(500).json({
      message: "Failed to change password.",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  changeMyPassword,
};