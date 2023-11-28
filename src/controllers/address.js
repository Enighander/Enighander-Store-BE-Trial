// const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common.js");
const {
  selectAllAddress,
  countData,
  insert,
  findUUID,
  findUserId,
  selectAddressById,
  update,
  deleteData,
  selectAddressByUsersId,
} = require("../models/address.js");

const addressController = {
  getAll: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort ? req.query.sort.toUpperCase() : "ASC";
      const result = await selectAllAddress({
        limit,
        offset,
        sortby,
        sort,
      });
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(
        res,
        result.rows,
        200,
        "succeed get all address data",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },
  getAddressByUserId: async (req, res) => {
    const user_id = String(req.params.user_id);
    const result = await selectAddressByUsersId(user_id);
    try {
      if (result.rows.length === 0) {
        return commonHelper.response(
          res,
          null,
          404,
          "Address User ID not found"
        );
      }
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while get Address By User ID.");
    }
  },
  insertAddress: async (req, res) => {
    const id = uuidv4();
    const {
      recipient_name,
      address_as,
      address,
      phone,
      postal_code,
      city,
      user_id,
    } = req.body;
    const data = {
      id,
      recipient_name,
      address_as,
      address,
      phone,
      postal_code,
      city,
      user_id,
    };

    try {
      // Log the incoming data for debugging
      console.log("Incoming data:", data);

      const { rowCount } = await findUserId(user_id);

      // Log the result of findUserId for debugging
      console.log("findUserId result:", rowCount);

      if (rowCount >= 0) {
        const result = await insert(data);
        commonHelper.response(res, result.rows, 201, "Address Created");
      } else {
        return commonHelper.response(
          res,
          null,
          404,
          "User already has an address"
        );
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while creating order.");
    }
  },
  updateAddress: async (req, res) => {
    const id = String(req.params.id);
    const { recipient_name, address_as, address, phone, postal_code, city } =
      req.body;
    try {
      const rowCount = await selectAddressById(id);
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "ID not found");
      }
      const data = {
        id,
        recipient_name,
        address_as,
        address,
        phone,
        postal_code,
        city,
      };
      const result = await update(data);
      commonHelper.response(
        res,
        result.rows,
        200,
        "Address Updated Successfully"
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send("An error occurred while update the address");
    }
  },
  deleteAddress: async (req, res) => {
    const id = String(req.params.id);
    const { rowCount } = await findUUID(id);
    try {
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "ID not found");
      }
      const result = await deleteData(id);
      commonHelper.response(
        res,
        result.rows,
        200,
        "Address deleted successfully"
      );
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("An error occurred while get deleted the Address.");
    }
  },
};

module.exports = addressController;
