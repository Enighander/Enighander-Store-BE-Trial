const pool = require("../config/db.js");

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const validColumns = ["id", "bank_name", "photo_bank"];

  if (!validColumns.includes(sortby)) {
    throw new Error(`Invalid column name: ${sortby}`);
  }

  const queryString = `SELECT * FROM bank ORDER BY ${sortby} ${sort} LIMIT $1 OFFSET $2`;

  try {
    const result = await pool.query(queryString, [limit, offset]);
    return result;
  } catch (error) {
    throw error;
  }
};

const countData = async () => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM bank");
    return result;
  } catch (error) {
    throw error;
  }
};

const findID = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM bank WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const insert = async (data) => {
  const { id, bank_name, photo_bank } = data;
  try {
    const result = await pool.query(
      "INSERT INTO bank (id, bank_name, photo_bank) VALUES ($1, $2, $3)",
      [id, bank_name, photo_bank]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (id) => {
  try {
    const result = await pool.query("DELETE FROM bank WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  selectAll,
  countData,
  findID,
  insert,
  deleteData,
};
