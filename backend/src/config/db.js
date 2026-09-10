const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate:
      process.env.DB_TRUST_SERVER_CERT === "true",
  },
};

let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log("Database connected successfully.");
    return pool;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error("Database has not been connected yet.");
  }

  return pool;
};

module.exports = {
  sql,
  connectDB,
  getPool,
};