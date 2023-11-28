const pool = require("../config/db.js");

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const validColumns = ["id", "username", "email"];

  if (!validColumns.includes(sortby)) {
    throw new Error(`Invalid column name: ${sortby}`);
  }

  const queryString = `SELECT * FROM admin ORDER BY ${sortby} ${sort} LIMIT $1 OFFSET $2`;

  try {
    const result = await pool.query(queryString, [limit, offset]);
    return result;
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  const { id, username, email, passwordHash } = data;
  const role = "admin";
  try {
    const result = await pool.query(
      "INSERT INTO admin (id, username, email, password, role) VALUES($1, $2, $3, $4, $5)",
      [id, username, email, passwordHash, role]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const update = async (data) => {
  const { id, username, email } = data;
  try {
    const result = await pool.query(
      "UPDATE admin SET username = $1, email = $2 WHERE id = $3",
      [username, email, id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const select = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM admin WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const findEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

const countData = async () => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM admin");
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (id) => {
  try {
    const result = await pool.query("DELETE FROM admin WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  selectAll,
  create,
  update,
  findEmail,
  select,
  countData,
  deleteData,
};
