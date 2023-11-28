// const claudinary = require("../middlewares/claudinary.js");
const commonHelper = require("../helper/common.js");
const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const {
  selectAll,
  update,
  create,
  countData,
  findEmail,
  deleteData,
  select,
} = require("../models/admin.js");
const bcrypt = require("bcryptjs");
const authHelper = require("../helper/auth.js");
const jwt = require("jsonwebtoken");

const adminController = {
  getAllAdmin: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAll({ limit, offset, sort, sortby });
      const {
        rows: [{ count }],
      } = await countData();
      const totalData = parseInt(count);
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
        "Get Data Success",
        pagination
      );
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },
  getAdmin: async (req, res) => {
    const id = req.params.id;
    const result = await select(id);
    try {
      if (result.rows.length === 0) {
        return commonHelper.response(res, null, 404, "Admin not found");
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
        .send("An error occurred while get specific the admin.");
    }
  },
  registerAdmin: async (req, res, next) => {
    const { username, email, password, role } = req.body;
    const { rowCount } = await findEmail(email);
    try {
      if (rowCount) {
        return next(
          createError(403, "Email is already used. Please try again")
        );
      }
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const data = {
        id: uuidv4(),
        username,
        email,
        passwordHash,
        role,
      };
      const result = await create(data);
      commonHelper.response(res, result.rows, 201, "Admin User Created");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while creating the account.");
    }
  },
  loginAdmin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const {
        rows: [admin],
      } = await findEmail(email);
      
      if (!admin) {
        return next(createError(403, "Invalid password. Please try again"));
      }
      const isValidPassword = bcrypt.compareSync(password, admin.password);

      if (!isValidPassword) {
        return next(createError(403, "Invalid email. Please try again"));
      }
      delete admin.password;
      const payload = {
        email: admin.email,
        role: admin.role,
      };
      admin.token = authHelper.generateToken(payload);
      admin.refreshToken = authHelper.generateRefreshToken(payload);
      commonHelper.response(res, admin, 201, "log in successful");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while login the account.");
    }
  },
  updateAdmin: async (req, res) => {
    const id = String(req.params.id);
    const { username, email } = req.body;
    try {
      const { rowCount } = await select(id);
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "ID not found");
      }
      const data = {
        id,
        username,
        email,
      };
      const result = await update(data);
      commonHelper.response(res, result.rows, 200, "Updated successfully");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while updating the data.");
    }
  },
  profileAdmin: async (req, res, next) => {
    const email = req.payload.email;
    const {
      rows: [user],
    } = await findEmail(email);
    delete user.password;
    commonHelper.response(res, user, 200);
  },
  deleteAdmin: async (req, res) => {
    const id = String(req.params.id);
    try {
      const deleteResult = await deleteData(id);
      if (deleteResult.rowCount === 0) {
        return commonHelper.response(res, null, 404, "Account not found");
      }
      commonHelper.response(res, null, 200, "deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while get deleted the account.");
    }
  },
  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT);
    const payload = {
      email: decoded.email,
      role: decoded.role,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200, "Session Restored");
  }
};

module.exports = adminController;
