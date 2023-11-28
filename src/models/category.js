const pool = require("../config/db.js");

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const validColumns = [
    "id", 
    "name"
  ];

  if (!validColumns.includes(sortby)) {
    throw new Error(`Invalid column name: ${sortby}`);
  }

  const queryString = `SELECT * FROM category ORDER BY ${sortby} ${sort} LIMIT $1 OFFSET $2`;

  try {
    const result = await pool.query(queryString, [limit, offset]);
    return result;
  } catch (error) {
    throw error;
  }
};

const select = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM category WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const insert = async (data) => {
  const { id, name, image } = data;

  try {
    const result = await pool.query(
      "INSERT INTO category (id, name, image) VALUES ($1, $2, $3)",
      [id, name, image]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const update = async (data, id) => {
  const { name, image } = data;

  try {
    const result = await pool.query(
      "UPDATE category SET name = $1, image = $2 WHERE id = $3",
      [name, image, id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const countData = async () => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM category");
    return result;
  } catch (error) {
    throw error;
  }
};

const findId = async (id) => {
  try {
    const result = await pool.query("SELECT id FROM category WHERE id = $1", [
      id,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (id) => {
  try {
    const result = await pool.query("DELETE FROM category WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  selectAll,
  select,
  countData,
  insert,
  update,
  findId,
  deleteData
};
