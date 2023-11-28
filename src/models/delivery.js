const pool = require("../config/db.js");

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const validColumns = ["id", "delivery_price"];

  if (!validColumns.includes(sortby)) {
    throw new Error(`Invalid column name: ${sortby}`);
  }

  const queryString = `SELECT * FROM delivery ORDER BY ${sortby} ${sort} LIMIT $1 OFFSET $2`;

  try {
    const result = await pool.query(queryString, [limit, offset]);
    return result;
  } catch (error) {
    throw error;
  }
};

const insert = async (data) => {
  const { id } = data;
  try {
    const result = await pool.query(
      "INSERT INTO address (id) VALUES ($1)",
      [id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const countData = async () => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM delivery");
    return result;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  selectAll,
  insert,
  countData
};
