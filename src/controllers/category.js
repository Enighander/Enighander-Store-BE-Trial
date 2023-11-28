const { v4: uuid4 } = require("uuid");
const commonHelper = require("../helper/common.js");
const cloudinary = require("../middlewares/claudinary.js");
const {
  selectAll,
  select,
  countData,
  insert,
  update,
  findId,
  deleteData,
} = require("../models/category.js");
// const joi = require("joi");

const categoryController = {
  getAllCategory: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort ? req.query.sort.toUpperCase() : "ASC";
      const result = await selectAll({ limit, offset, sort, sortby });
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
        "succeed get all categories data ",
        pagination
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while get all the category.");
    }
  },
  getCategory: async (req, res) => {
    const id = String(req.params.id);
    const result = await select(id);
    try {
      if (result.rows.length === 0) {
        return commonHelper.response(res, null, 404, "Category not found");
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
  insertCategory: async (req, res) => {
    // const schema = joi.object({
    //   id: joi.number(),
    //   name: joi.string(),
    //   image: joi.string()
    // })
    // const result = schema.validate(req.body);
    // const { value, error } = result;
    // if(error){
    //   return commonHelper.response(res, result.rows, 422, error.message)
    // }
    const id = uuid4();
    const { name } = req.body;
    try {
      let image = "";
      if (req.file && req.file.path) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;
      }
      const data = {
        id,
        name,
        image,
      };
      const result = await insert(data);
      commonHelper.response(res, result.rows, 201, "Category created");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while created the category.");
    }
  },
  updateCategory: async (req, res) => {
    const id = String(req.params.id);
    try {
      const { rowCount } = await findId(id);
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "Category not found");
      }

      let image = "";

      if (req.file && req.file.path) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;
      }

      const { name } = req.body;

      const data = {
        name,
        image,
      };

      const result = await update(data, id);
      commonHelper.response(
        res,
        result.rows,
        200,
        "Category updated successfully"
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while updated the category.");
    }
  },
  deleteCategory: async (req, res) => {
    const id = String(req.params.id);
    try {
      const deleteResult = await deleteData(id);

      if (deleteResult.rowCount === 0) {
        return commonHelper.response(res, null, 404, "Category not found");
      }

      commonHelper.response(res, null, 200, "Category deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while deleted the category.");
    }
  },
};

module.exports = categoryController;
