const { getPool, sql } = require("../config/db");

const getProducts = async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT
        id,
        name,
        sku,
        category,
        quantity,
        unit_price,
        created_at,
        updated_at
      FROM Products
      ORDER BY id DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error retrieving products:", error.message);

    res.status(500).json({
      message: "Failed to retrieve products",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, category, quantity, unit_price } = req.body;

    if (!name || !sku || !category) {
      return res.status(400).json({
        message: "Name, SKU, and category are required.",
      });
    }

    const pool = getPool();

    const result = await pool
      .request()
      .input("name", sql.NVarChar(100), name)
      .input("sku", sql.NVarChar(50), sku)
      .input("category", sql.NVarChar(50), category)
      .input("quantity", sql.Int, quantity ?? 0)
      .input("unit_price", sql.Decimal(10, 2), unit_price ?? 0)
      .query(`
        INSERT INTO Products
          (name, sku, category, quantity, unit_price)
        OUTPUT
          INSERTED.id,
          INSERTED.name,
          INSERTED.sku,
          INSERTED.category,
          INSERTED.quantity,
          INSERTED.unit_price,
          INSERTED.created_at,
          INSERTED.updated_at
        VALUES
          (@name, @sku, @category, @quantity, @unit_price)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error("Error creating product:", error.message);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT
          id,
          name,
          sku,
          category,
          quantity,
          unit_price,
          created_at,
          updated_at
        FROM Products
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error retrieving product:", error.message);

    res.status(500).json({
      message: "Failed to retrieve product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, category, quantity, unit_price } = req.body;

    if (!name || !sku || !category) {
      return res.status(400).json({
        message: "Name, SKU, and category are required.",
      });
    }

    const pool = getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar(100), name)
      .input("sku", sql.NVarChar(50), sku)
      .input("category", sql.NVarChar(50), category)
      .input("quantity", sql.Int, quantity ?? 0)
      .input("unit_price", sql.Decimal(10, 2), unit_price ?? 0)
      .query(`
        UPDATE Products
        SET
          name = @name,
          sku = @sku,
          category = @category,
          quantity = @quantity,
          unit_price = @unit_price,
          updated_at = GETDATE()
        WHERE id = @id;

        SELECT
          id,
          name,
          sku,
          category,
          quantity,
          unit_price,
          created_at,
          updated_at
        FROM Products
        WHERE id = @id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error updating product:", error.message);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM Products
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error.message);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};