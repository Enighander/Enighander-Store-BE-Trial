const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common.js");
const createError = require("http-errors");
const {
  selectAll,
  countData,
  selectUserById,
  selectOrdersById,
  selectOrderUser,
  findUserId,
  findUUID,
  updateCompletedStatus,
  updateSendingStatus,
  updateProceedStatus,
  updateGetPaidStatus,
  updateCanceledStatus,
  updateOrder,
  deleteOrder,
  insertOrder,
  deleteAllData,
  selectOrderAdmin,
} = require("../models/order.js");

const orderController = {
  getAllOrder: async (req, res) => {
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
        "succeed get all order data",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },
  insert: async (req, res) => {
    const id = uuidv4();
    const { user_id, admin_id, order_color, product_id, quantity } = req.body;
    const data = {
      id,
      user_id,
      admin_id,
      order_color,
      product_id,
      quantity,
    };
    try {
      const result = await insertOrder(data);
      commonHelper.response(res, result.rows, 201, "Order Created");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while creating order.");
    }
  },
  update: async (req, res, next) => {
    const id = String(req.params.id);
    const { address_id } = req.body;
    const { rowCount } = await findUUID(id);
    try {
      if (!rowCount) {
        return next(createError(404, "ID is not Found"));
      }
      const data = {
        id,
        address_id,
      };
      const result = await updateOrder(data);
      commonHelper.response(
        res,
        result.rows,
        200,
        "Order Updated Successfully"
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while update the order");
    }
  },
  getOrderById: async (req, res) => {
    const admin_id = String(req.params.admin_id);
    const result = await selectOrdersById(admin_id);
    try {
      if (result.rows.length === 0) {
        return commonHelper.response(res, null, 404, "Order not found");
      }
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while get specific order.");
    }
  },
  getOrderByUserId: async (req, res) => {
    const user_id = String(req.params.user_id);
    try {
      const result = await selectUserById(user_id);
      console.log("data :",result)
      if (result.rows.length === 0) {
        return commonHelper.response(res, null, 404, "Order not found");
      }
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while get specific order.");
    }
  },
  getStatusByUserId: async (req, res) => {
    const user_id = String(req.params.user_id);
    const status_orders = String(req.params.status_orders);
    try {
      const result = await selectOrderUser(user_id, status_orders);
      if (result.rows.length === 0) {
        return commonHelper.response(res, [], 404, "No pending orders found");
      }
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred while get status order by user id.");
    }
  },
  getStatusByAdminId: async (req, res) => {
    const admin_id = String(req.params.admin_id);
    const status_orders = String(req.params.status_orders);
    try {
      const result = await selectOrderAdmin(admin_id, status_orders);
      if (result.rows.length === 0) {
        return commonHelper.response(res, [], 404, "No pending orders found");
      }
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred while get status order by user id.");
    }
  },
  updateStatusPaid: async (req, res, next) => {
    const user_id = String(req.params.user_id);
    const { rowCount } = await findUserId(user_id);
    try {
      if (!rowCount) {
        return next(createError(404, "ID is not Found"));
      }
      const result = await updateGetPaidStatus({ user_id });
      commonHelper.response(res, result.rows, 200, "Updated Status Success");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating status order User.");
    }
  },
  updateStatusProcessed: async (req, res, next) => {
    const id = String(req.params.id);
    const { rowCount } = await findUUID(id);
    try {
      if (!rowCount) {
        return next(createError(404, "ID is not Found"));
      }
      const result = await updateProceedStatus({ id });
      commonHelper.response(res, result.rows, 200, "Updated Status Success");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating status order User.");
    }
  },
  updateStatusSent: async (req, res, next) => {
    const id = String(req.params.id);
    const { rowCount } = await findUUID(id);
    try {
      if (!rowCount) {
        return next(createError(404, "ID is not Found"));
      }
      const result = await updateSendingStatus({ id });
      commonHelper.response(res, result.rows, 200, "Updated Status Success");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating status order User.");
    }
  },
  updateStatusCompleted: async (req, res, next) => {
    const id = String(req.params.id);
    const { rowCount } = await findUUID(id);
    try {
      if (!rowCount) {
        return next(createError(404, "ID is not Found"));
      }
      const result = await updateCompletedStatus({ id });
      commonHelper.response(res, result.rows, 200, "Updated Status Success");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating status order User.");
    }
  },
  updateStatusCanceled: async (req, res, next) => {
    const id = String(req.params.id);
    const { rowCount } = await findUUID(id);
    try {
      if (!rowCount) {
        return next(createError(404, "ID is not Found"));
      }
      const result = await updateCanceledStatus({ id });
      commonHelper.response(res, result.rows, 200, "Updated Status Success");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating status order User.");
    }
  },
  delete: async (req, res, next) => {
    const id = String(req.params.id);
    const { rowCount } = await findUUID(id);
    try {
      if (!rowCount) {
        return next(createError(404, "ID is not Found"));
      }
      const result = await deleteOrder(id);
      commonHelper.response(res, result.rows, 200, "Order deleted successfully");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("An error occurred while get deleted the Order.");
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      const result = await deleteAllData(); // Use the deleteAllData query
      commonHelper.response(res, result.rows, 200, "All data deleted successfully");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while deleting all data.");
    }
  }
};

module.exports = orderController;
