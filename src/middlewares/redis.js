// const client = require("../config/redis.js");
// const { response } = require("../helper/common.js");

// const hitCacheProductDetail = async (req, res, next) => {
//   try {
//     const idProduct = req.params.id;
//     const product = await client.get(`products/${idProduct}`);
//     if (product) {
//       return response(
//         res,
//         JSON.parse(product),
//         200,
//         "Data retrieved from Redis cache"
//       );
//     }

//     next();
//   } catch (error) {
//     console.error("Error fetching data from Redis:", error);
//     next(error);
//   }
// };

// const clearCacheProductDetail = (req, res, next) => {
//   const idProduct = req.params.id;
//   client.del(`products/${idProduct}`);
//   next();
// };

// const hitCacheCategoryProductDetail = async (req, res, next) => {
//   try {
//     const idCategory = req.params.id;
//     const category = await client.get(`products/categories/${idCategory}`);
//     if (category) {
//       return response(
//         res,
//         JSON.parse(category),
//         200,
//         "Data retrieved from Redis cache"
//       );
//     }

//     next();
//   } catch (error) {
//     console.error("Error fetching data from Redis:", error);
//     next(error);
//   }
// };

// const clearCacheCategoryProductDetail = (req, res, next) => {
//   const idCategory = req.params.id;
//   client.del(`products/categories/${idCategory}`);
//   next();
// };

// const hitCacheAdminProductDetail = async (req, res, next) => {
//   try {
//     const idCategory = req.params.id;
//     const category = await client.get(`products/categories/${idCategory}`);
//     if (category) {
//       return response(
//         res,
//         JSON.parse(category),
//         200,
//         "Data retrieved from Redis cache"
//       );
//     }

//     next();
//   } catch (error) {
//     console.error("Error fetching data from Redis:", error);
//     next(error);
//   }
// };

// const clearCacheAdminProductDetail = (req, res, next) => {
//   const idCategory = req.params.id;
//   client.del(`products/categories/${idCategory}`);
//   next();
// };




// module.exports = {
//   hitCacheProductDetail,
//   clearCacheProductDetail,
//   hitCacheCategoryProductDetail,
//   clearCacheCategoryProductDetail,
//   hitCacheAdminProductDetail,
//   clearCacheAdminProductDetail
// };
