const pool = require("../config/db.js");

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const validColumns = [
    "id",
    "user_id",
    "bank_id",
    "total_payment",
    "status_payment",
    "created_at",
  ];

  if (!validColumns.includes(sortby)) {
    throw new Error(`Invalid column name: ${sortby}`);
  }

  const queryString = `SELECT * FROM payment ORDER BY ${sortby} ${sort} LIMIT $1 OFFSET $2`;

  try {
    const result = await pool.query(queryString, [limit, offset]);
    return result;
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  const { id, user_id, bank_id, total_payment} = data;
  try {
    const result = await pool.query(
      "INSERT INTO payment (id, user_id, bank_id, total_payment) VALUES($1, $2, $3, $4)",
      [id, user_id, bank_id, total_payment]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const select = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM payment WHERE id = $1", [
      id,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

const selectUserId = async (user_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM payment WHERE user_id = $1",
      [user_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (id) => {
  try {
    const result = await pool.query("DELETE FROM payment WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const countData = async () => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM payment");
    return result;
  } catch (error) {
    throw error;
  }
};

const findUUID = async (id) => {
  try {
    const result = await pool.query(
      "SELECT payment FROM payment WHERE id = $1",
      [id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports= {
  selectAll,
  create,
  select,
  selectUserId,
  deleteData,
  countData,
  findUUID
};