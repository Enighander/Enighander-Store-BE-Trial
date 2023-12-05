const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common.js");
const cloudinary = require("../middlewares/claudinary.js");
const { addProductSchema } = require("../validator/product.js");
const path = require('path')
// const client = require("../config/redis.js");
const {
  selectAll,
  select,
  searchProduct,
  countData,
  insert,
  update,
  deleteData,
  findId,
  selectProductByCategoryId,
  selectProductByAdminId,
} = require("../models/product.js");

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "name";
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
        "succeed get all products data ",
        pagination
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while get all the products.");
    }
  },
  getProduct: async (req, res) => {
    try {
      const id = String(req.params.id);
      // const cachedData = await client.get(`products/${id}`);
      // if (cachedData) {
      //   return commonHelper.response(
      //     res,
      //     JSON.parse(cachedData),
      //     200,
      //     "Data retrieved from Redis cache"
      //   );
      // }
      const result = await select(id);
      if (result.rows.length === 0) {
        return commonHelper.response(res, null, 404, "Product not found");
      }
      // await client.set(`products/${id}`, JSON.stringify(result.rows));
      commonHelper.response(
        res,
        result.rows,
        200,
        "Data retrieved from the database"
      );
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred while fetching the specific product.");
    }
  },
  getProductByCategoryId: async (req, res) => {
    try {
      const category = String(req.params.category);
      // const cachedData = await client.get(`products/categories/${category}`);
  
      // if (cachedData) {
      //   return commonHelper.response(
      //     res,
      //     JSON.parse(cachedData),
      //     200,
      //     "Data retrieved from Redis cache"
      //   );
      // }
  
      const result = await selectProductByCategoryId(category);
  
      if (result.length === 0) {
        return commonHelper.response(res, null, 404, "No products found for the specified category");
      }
  
      // await client.set(`products/categories/${category}`, JSON.stringify(result));
  
      commonHelper.response(
        res,
        result,
        200,
        "Data retrieved from the database"
      );
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).send("An error occurred while fetching the specific product category.");
    }
  },
  getProductByAdminId: async (req, res) => {
    try {
      const admin_id = String(req.params.admin_id);
      // const cachedData = await client.get(`product/admin/${admin_id}`);
  
      // if (cachedData) {
      //   return commonHelper.response(
      //     res,
      //     JSON.parse(cachedData),
      //     200,
      //     "Data retrieved from Redis cache"
      //   );
      // }
  
      const result = await selectProductByAdminId(admin_id);
  
      if (result.length === 0) {
        return commonHelper.response(res, null, 404, "No products found for the specified category");
      }
  
      // await client.set(`product/admin/${admin_id}`, JSON.stringify(result));
  
      commonHelper.response(
        res,
        result,
        200,
        "Data retrieved from the database"
      );
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).send("An error occurred while fetching the specific product category.");
    }
  },
  searchItem: async (req, res) => {
    const search = (req.query.search || "").trim();
    if (search === "") {
      return res.status(404).json({ message: "The search field is empty" });
    }
    try {
      const result = await searchProduct({ search });
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      return commonHelper.response(res, result.rows, 200, "get data success");
    } catch (err) {
      console.error("Error searching for products:", err);
      console.error(err.stack);
      return res
        .status(500)
        .json({ error: "An error occurred while searching for products" });
    }
  },
  insertProduct: async (req, res) => {
    const id = uuidv4()
    const { name, description, price, color, category, admin_id } = req.body;
    try {
      const {error} = addProductSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({error: errorMessage})
      }
      let image = "";
      if (req.file && req.file.filename) {
        const imagePath = path.join('E-Store', 'Product', req.file.filename);
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: imagePath.replace(/\\/g, '/'),
          overwrite: true,
        })
        image = result.secure_url;
      }

      const data = {
        id,
        name,
        description,
        image,
        price,
        color,
        category,
        admin_id
      };
      const result = await insert(data);
      commonHelper.response(res, result.rows, 201, "Product created");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while creating the product.");
    }
  },
  updateProduct: async (req, res) => {
    const id = String(req.params.id);
    try {
      const { rowCount } = await findId(id);
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "Product not found");
      }

      // Use req.file to get the uploaded file information
      let image = "";

      if (req.file && req.file.path) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;
      }

      const { name, description, price, color, category } = req.body;

      const data = {
        name,
        description,
        image,
        price,
        color,
        category,
      };

      const result = await update(data, id);
      commonHelper.response(
        res,
        result.rows,
        200,
        "Product updated successfully"
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while updating the product.");
    }
  },
  deleteProduct: async (req, res) => {
    const id = String(req.params.id);
    try {
      const deleteResult = await deleteData(id);

      if (deleteResult.rowCount === 0) {
        return commonHelper.response(res, null, 404, "Product not found");
      }

      commonHelper.response(res, null, 200, "Product deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while get deleted the products.");
    }
  },
};

module.exports = productController;
