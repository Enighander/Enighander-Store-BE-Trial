const pool = require("../config/db.js");
// --------------------------------------------------------------------------------------//
// The error you're encountering is likely due to the fact that you're using placeholders
// for column names ($1 and $2) in the ORDER BY clause of your SQL query.

// const selectAll = ({ limit, offset, sort, sortby }) => {
//   return pool.query(
//     "SELECT * FROM product ORDER BY $1, $2 LIMIT $3 OFFSET $4",
//     [limit, offset, sort, sortby]
//   );
// };

// --------------------------------------------------------------------------------------//
// const selectAll = ({ limit, offset, sort, sortby }) => {
//   return pool.query(
//     `SELECT * FROM product ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
//   );
// };
// --------------------------------------------------------------------------------------//

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const validColumns = [
    "name",
    "description",
    "image",
    "price",
    "color",
    "category",
    "admin_id"
  ];

  if (!validColumns.includes(sortby)) {
    throw new Error(`Invalid column name: ${sortby}`);
  }

  const queryString = `SELECT * FROM product ORDER BY ${sortby} ${sort} LIMIT $1 OFFSET $2`;

  try {
    const result = await pool.query(queryString, [limit, offset]);
    return result;
  } catch (error) {
    throw error;
  }
};

const select = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM product WHERE id = $1", [id,]);
    return result;
  } catch (error) {
    throw error;
  }
};

const selectProductByCategoryId = async (category) => {
  try {
    const result = await pool.query(
      `SELECT product.* FROM product JOIN category ON product.category = category.id WHERE category.id = $1`, [category,]);
    return result.rows;
  } catch (error) {
    throw error
  }
};

const selectProductByAdminId = async (admin_id) => {
  try {
    const result = await pool.query(
      `SELECT product.* FROM product JOIN admin ON product.admin_id = admin.id WHERE admin.id = $1`, [admin_id,])
    return result.rows;
  } catch (error) {
    throw error
  }
};

const searchProduct = async ({search}) => {
  try {
    const result = await pool.query(
      'SELECT * FROM product WHERE name ILIKE $1',[`%${search}%`]
    );
    return result;
  } catch (error) {
    throw error
  }
};

const insert = async (data) => {
  const { id, name, description, image, price, color, category, admin_id } = data;
  try {
    const result = await pool.query(
      "INSERT INTO product (id, name, description, image, price, color, category, admin_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
      [id, name, description, image, price, color, category, admin_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const update = async (data, id) => {
  const { name, description, image, price, color, category } = data;

  try {
    const result = await pool.query(
      "UPDATE product SET name = $1, description = $2, image = $3, price = $4, color = $5, category = $6 WHERE id = $7",
      [name, description, image, price, color, category, id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const countData = async () => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM product");
    return result;
  } catch (error) {
    throw error;
  }
};

const findId = async (id) => {
  try {
    const result = await pool.query("SELECT id FROM product WHERE id = $1", [
      id,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (id) => {
  try {
    const result = await pool.query("DELETE FROM product WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  selectAll,
  select,
  selectProductByCategoryId,
  selectProductByAdminId,
  searchProduct,
  insert,
  update,
  deleteData,
  countData,
  findId
};
