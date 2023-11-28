const pool = require("../config/db.js");

const selectAllAddress = async ({ limit, offset, sort, sortby }) => {
  const validColumns = [
    "id",
    "recipient_name",
    "address_as",
    "address",
    "phone",
    "postal_code",
    "city",
    "user_id",
  ];

  if (!validColumns.includes(sortby)) {
    throw new Error(`Invalid column name: ${sortby}`);
  }

  const queryString = `SELECT * FROM address ORDER BY ${sortby} ${sort} LIMIT $1 OFFSET $2`;

  try {
    const result = await pool.query(queryString, [limit, offset]);
    return result;
  } catch (error) {
    throw error;
  }
};

const selectAddressById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM address WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const selectAddressByUsersId = async (user_id) => {
  try {
    const result = await pool.query("SELECT * FROM address WHERE user_id = $1", [user_id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const insert = async (data) => {
  const {
    id,
    recipient_name,
    address_as,
    address,
    phone,
    postal_code,
    city,
    user_id,
  } = data;
  try {
    const result = await pool.query(
      "INSERT INTO address (id, recipient_name, address_as, address, phone, postal_code, city, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        id,
        recipient_name,
        address_as,
        address,
        phone,
        postal_code,
        city,
        user_id,
      ]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const update = async (data) => {
  const { id, recipient_name, address_as, address, phone, postal_code, city } = data;
  try {
    const result = await pool.query(
      "UPDATE address SET recipient_name = $1, address_as = $2, address = $3, phone = $4, postal_code = $5, city = $6 WHERE id = $7",
      [recipient_name, address_as, address, phone, postal_code, city, id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (id) => {
  try {
    const result = await pool.query("DELETE FROM address WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const findUUID = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM address WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const findUserId = async (user_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM address WHERE user_id = $1",
      [user_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const countData = async () => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM address");
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  selectAllAddress,
  selectAddressById,
  selectAddressByUsersId,
  insert,
  update,
  deleteData,
  countData,
  findUUID,
  findUserId,
};
