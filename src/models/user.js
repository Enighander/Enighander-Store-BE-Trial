const pool = require("../config/db.js");

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const validColumns = ["id", "username", "email"];

  if (!validColumns.includes(sortby)) {
    throw new Error(`Invalid column name: ${sortby}`);
  }

  const queryString = `SELECT * FROM users ORDER BY ${sortby} ${sort} LIMIT $1 OFFSET $2`;

  try {
    const result = await pool.query(queryString, [limit, offset]);
    return result;
  } catch (error) {
    throw error;
  }
};

const select = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const findEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

const findUUID = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  const { id, username, email, phone, passwordHash, role } = data;
  try {
    const result = await pool.query(
      "INSERT INTO users (id, username, email, phone, password, role) VALUES($1, $2, $3, $4, $5, $6)",
      [id, username, email, phone, passwordHash, role]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const update = async (data) => {
  const {id, username, email, phone, image_profile} = data;
  try {
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2, phone = $3, image_profile = $4 WHERE id = $5",
      [username, email, phone, image_profile, id]
    );
    return result;
  } catch (error) {
    throw error;
  }

};

const deleteData = async (id) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const countData = async () => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM user");
    return result;
  } catch (error) {
    throw error;
  }
};

const findUserId = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  selectAll,
  select,
  findEmail,
  findUUID,
  findUserId,
  create,
  deleteData,
  update,
  countData
};
