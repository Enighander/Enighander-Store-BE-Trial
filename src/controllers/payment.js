const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common.js");
const createError = require("http-errors");
const {
  selectAll, 
  countData,
  create,
  findUUID,
  deleteData,
  selectUserId,
  select
} = require("../models/payment.js");

const paymentController = {
  getAllPayment: async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        const sortby = req.query.sortby || "id";
        const sort = req.query.sort ? req.query.sort.toUpperCase() : "ASC";
        const result = await selectAll({
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
          "succeed get all data",
          pagination
        );
      } catch (error) {
        console.log(error);
      }
  },
  getPaymentById: async(req, res) => {
    const id = req.params.id;
    const result = await select(id);
    try {
      if (result.rows.length === 0) {
        return commonHelper.response(res, null, 404, "ID not found");
      }
      commonHelper.response(
        res,
        result.rows,
        200,
        "get data success from database"
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send("An error occurred while get specific the category.");
    }
  },
  getPaymentByUserId: async (req, res, next) => {
    const user_id = String(req.params.user_id);
    const result = await selectUserId(user_id);
    try {
      if (result.rows.length === 0) {
        return next(createError(404, "ID is not Found"));
      }
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while get specific user ID.");
    }
  },
  createPayment: async (req,res) => {
    const id = uuidv4();
    const { user_id, bank_id, total_payment } = req.body;
    const data = {
      id,
      user_id,
      bank_id,
      total_payment
    };
    try {
      const result = await create(data);
      commonHelper.response(res, result.rows, 201, "Payment Successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while making payment.");
    }
  },
  delete: async (req, res, next) => {
    const id = String(req.params.id);
    const { rowCount } = await findUUID(id);
    try {
      if (!rowCount) {
        return next(createError(404, "ID is not Found"));
      }
      const result = await deleteData(id);
      commonHelper.response(res, result.rows, 200, "Payment deleted successfully");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("An error occurred while deleted the payment.");
    }
  }
};

module.exports = paymentController;