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

const updateData = async (data) => {
  const {id, username, email, phone} = data;
  try {
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2, phone = $3 WHERE id = $4",
      [username, email, phone, id]
    );
    return result;
  } catch (error) {
    throw error;
  }

};

const updateImage = async (data) => {
  const {id, image_profile } = data;
  try {
    const result = await pool.query(
      "UPDATE users SET image_profile = $1 WHERE id = $2",
      [image_profile, id]
    );
    return result;
  } catch (error) {
    throw error;
  }
}

const updatePassword = async (data) => {
  const {id, passwordHash} = data;
  try {
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [passwordHash, id]
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
  updateData,
  updateImage,
  updatePassword,
  countData
};
