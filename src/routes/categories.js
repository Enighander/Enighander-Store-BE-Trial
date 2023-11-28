const express = require('express');
const router = express.Router();
const categoryController = require ('../controllers/category.js')
const {uploadCategory, uploadToCloudinary} = require ('../middlewares/uploadCategory.js')



router
.get('/',categoryController.getAllCategory)
.get('/:id',categoryController.getCategory)
.post('/',uploadCategory,uploadToCloudinary,categoryController. insertCategory)
.put('/:id',uploadCategory,uploadToCloudinary,categoryController. updateCategory)
.delete('/:id',categoryController.deleteCategory);



module.exports = router
