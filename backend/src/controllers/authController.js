const { getPool, sql } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    const pool = getPool();

    const result = await pool
      .request()
      .input("username", sql.NVarChar(50), username)
      .query(`
        SELECT
          id,
          username,
          password_hash,
          role
        FROM Users
        WHERE username = @username
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const user = result.recordset[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed.",
    });
  }
};

module.exports = {
  login,
};