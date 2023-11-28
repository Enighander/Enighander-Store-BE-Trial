const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common.js");
const { insert, selectAll, countData } = require("../models/delivery.js");

const deliveryController = {
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
        "succeed get all address data",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },
  insertDelivery: async (req, res) => {
    const id = uuidv4();
    const data = { id };
    try {
      const result = await insert(data);
      commonHelper.response(res, result.rows, 201, "Create Success");
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = deliveryController;
