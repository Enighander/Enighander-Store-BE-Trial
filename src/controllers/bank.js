const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const commonHelper = require("../helper/common.js");
const {
  selectAll,
  countData,
  insert,
  findID,
  deleteData,
} = require("../models/bank.js");

const bankController = {
  getAll: async (req, res) => {
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
        "succeed get all bank data",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },
  insertBank: async (req, res) => {
    const PORT = process.env.PORT || 8000;
    const DB_HOST = process.env.DB_HOST || "localhost";
    const { bank_name } = req.body;
    const photo_bank = req.file.filename;
    try {
      const data = {
        id: uuidv4(),
        bank_name,
        photo_bank: `http://${DB_HOST}:${PORT}/img/${photo_bank}`,
      };
      const result = await insert(data);
      commonHelper.response(res, result.rows, 201, "Create Success");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while create the bank.");
    }
  },
  deleteBank: async (req, res, next) => {
    const id = String(req.params.id);
    const { rowCount } = await findID(id);
    try {
      if (!rowCount) {
        return next(createError(404, "ID is not Found"));
      }
      const result = await deleteData(id);
      commonHelper.response(
        res,
        result.rows,
        200,
        "Bank deleted successfully"
      );
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("An error occurred while get deleted the Bank.");
    }
  }
};

module.exports = bankController;
