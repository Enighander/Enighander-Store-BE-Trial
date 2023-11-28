// const claudinary = require("../middlewares/claudinary.js");
const commonHelper = require("../helper/common.js");
const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const {
  selectAll,
  select,
  findEmail,
  findUUID,
  create,
  update,
  deleteData,
  countData,
} = require("../models/user.js");
const bcrypt = require("bcryptjs");
const authHelper = require("../helper/auth.js");
const jwt = require("jsonwebtoken");

const userController = {
  getAllUser: async (req, res, next) => {
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
  getUser: async (req, res, next) => {
    const id = req.params.id;
    const result = await select(id);
    try {
      if (result.rows.length === 0) {
        return commonHelper.response(res, null, 404, "User not found");
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
        .send("An error occurred while get specific the user.");
    }
  },
  registerUser: async (req, res, next) => {
    const { username, email, password, phone } = req.body;
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
        phone,
        passwordHash,
        role: "user",
      };
      const result = await create(data);
      commonHelper.response(res, result.rows, 201, "User Created");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while creating the account.");
    }
  },
  updateUser: async (req, res, next) => {
    const id = String(req.params.id);
    const { username, email, phone } = req.body;
    try {
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "User not found");
      }
      const data = {
        id,
        username,
        email,
        phone
      };
      const result = await update(data);
      commonHelper.response(
        res,
        result.rows,
        200,
        "User updated successfully"
      );
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while updating the user.");
    }
  },
  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const {
        rows: [user],
      } = await findEmail(email);
      if (!user) {
        return next(createError(403, "Invalid password. Please try again"));
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);

      if (!isValidPassword) {
        return next(createError(403, "Invalid email. Please try again"));
      }
      delete user.password;
      const payload = {
        email: user.email,
        role: user.role,
      };
      user.token = authHelper.generateToken(payload);
      user.refreshToken = authHelper.generateRefreshToken(payload);
      commonHelper.response(res, user, 201, "log in successful");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while login the account.");
    }
  },
  profileUser: async (req, res, next) => {
    const email = req.payload.email;
    const {
      rows: [users],
    } = await findEmail(email);
    delete users.password;
    commonHelper.response(res, users, 200);
  },
  deleteUser: async (req, res, next) => {
    const id = String(req.params.id);
    try {
      const deleteResult = await deleteData(id);

      if (deleteResult.rowCount === 0) {
        return commonHelper.response(res, null, 404, "User not found");
      }

      commonHelper.response(res, null, 200, "User deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while get deleted the user.");
    }
  },
  refreshToken: (req, res, next) => {
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

module.exports = userController;
