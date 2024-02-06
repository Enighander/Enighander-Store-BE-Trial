const cloudinary = require("../middlewares/claudinary.js");
const path = require("path");
const commonHelper = require("../helper/common.js");
const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const {
  registerUserSchema,
  updateUserSchema,
  updateUserPasswordSchema,
  updateUserImageSchema,
  loginUserSchema,
} = require("../validator/user.js");
const {
  selectAll,
  select,
  findEmail,
  findUUID,
  create,
  deleteData,
  countData,
  updatePassword,
  updateImage,
  updateData
} = require("../models/user.js");
const bcrypt = require("bcryptjs");
const authHelper = require("../helper/auth.js");
const jwt = require("jsonwebtoken");

const userController = {
  getAllUser: async (req, res) => {
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
  getUser: async (req, res) => {
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
      res.status(500).send("An error occurred while get specific the user.");
    }
  },
  registerUser: async (req, res, next) => {
    const { username, email, password, phone } = req.body;
    try {
      const { error } = registerUserSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({error: errorMessage})
      }
      const { rowCount } = await findEmail(email);
      if (rowCount) {
        return next(
          createError(403, "Email is already used. Please try again")
        );
      }

      // Use bcrypt.hash to generate the hash asynchronously
      const passwordHash = await bcrypt.hash(password, 10);

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
  updateUser: async (req, res) => {
    const id = String(req.params.id);
    try {
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "User not found");
      }

      const {error} = updateUserSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({error: errorMessage})
      }

      const { username, email, phone } = req.body;
      
      const data = {
        id,
        username,
        email,
        phone,
      };

      const result = await updateData(data, id);
      commonHelper.response(res, result.rows, 200, "User updated successfully");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while updating the user data.");
    }
  },
  updateUserImage: async (req, res) => {
    const id = String(req.params.id);

    try {
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        throw new Error("User not found");
      }
  
      let image_profile = "";
  
      // const {error} = updateUserImageSchema.validate(req.file.filename);
      // if (error) {
      //   const errorMessage = error.details[0].message;
      //   return res.status(400).json({error: errorMessage})
      // }

      if (req.file && req.file.filename) {
        const imagePath = path.join("E-Store", "Photo_profile", req.file.filename);
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: imagePath.replace(/\\/g, "/"),
          overwrite: true,
        });
        image_profile = result.secure_url;
      }
  
      const data = {
        id,
        image_profile
      };
  
      const result = await updateImage(data, id);
      commonHelper.response(res, result.rows, 200, "User updated successfully");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while updating the user image.");
    }
  },
  updateUserPassword: async (req, res) => {
    const id = String(req.params.id);
    const { password } = req.body;

    try {
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        return commonHelper.response(res.null, 404, "user not found");
      }

      const { error } = updateUserPasswordSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({ error: errorMessage });
      }
    
      const passwordHash = await bcrypt.hash(password, 10);
      const data = {
        id,
        passwordHash,
      };
      const result = await updatePassword(data, id);
      commonHelper.response(
        res,
        result.rows,
        200,
        "Password updated successfully"
      );
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("an error occurred while updating the password.");
    }
  },
  loginUser: async (req, res, next) => {
    try {

      const  {error, value} = loginUserSchema.validate(req.body);

      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({error: errorMessage});
      }

      const { email, password } = value;
      const {rows: [user]} = await findEmail(email.toLowerCase());
      if (!user) {
        return next(createError(403, "Invalid email. Please try again"));
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);

      if (!isValidPassword) {
        return next(createError(403, "Invalid password. Please try again"));
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
  profileUser: async (req, res) => {
    const email = req.payload.email;
    const {
      rows: [users],
    } = await findEmail(email);
    delete users.password;
    commonHelper.response(res, users, 200);
  },
  deleteUser: async (req, res) => {
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
  },
};

module.exports = userController;
