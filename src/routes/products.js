const express = require('express');
const router = express.Router();
const {uploadProduct,uploadToCloudinary } = require('../middlewares/uploadProduct.js')
const productController = require('../controllers/product.js');
// const {hitCacheProductDetail,clearCacheProductDetail,hitCacheCategoryProductDetail,clearCacheCategoryProductDetail, hitCacheAdminProductDetail} = require('../middlewares/redis.js');
// const {protect} = require("../middlewares/auth.js")
// const {validateProductRequest} = require('../validator/product.js');

// router
// .get('/',productController.getAllProducts)
// .get('/',productController.searchItem)
// .get('/:id',hitCacheProductDetail,productController.getProduct)
// .get('/admin/:admin_id',hitCacheAdminProductDetail,productController.getProductByAdminId)
// .get('/categories/:category',hitCacheCategoryProductDetail,productController.getProductByCategoryId)
// .post('/',uploadProduct,productController.insertProduct)
// .put('/:id',clearCacheProductDetail,uploadProduct,productController.updateProduct)
// .delete('/:id',clearCacheProductDetail,productController.deleteProduct);

router
.get('/',productController.getAllProducts)
.get('/',productController.searchItem)
.get('/:id',productController.getProduct)
.get('/admin/:admin_id',productController.getProductByAdminId)
.get('/categories/:category',productController.getProductByCategoryId)
.post('/',uploadProduct,uploadToCloudinary,productController.insertProduct)
.put('/:id',uploadProduct,uploadToCloudinary,productController.updateProduct)
.delete('/:id',productController.deleteProduct);





module.exports = router;