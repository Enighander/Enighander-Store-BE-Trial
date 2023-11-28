const express = require ('express')
const router = express.Router();
const addressController = require ('../controllers/address.js')

router
.get('/',addressController.getAll)
.get('/:user_id',addressController.getAddressByUserId)
.post('/',addressController. insertAddress)
.post('/:user_id', addressController.insertAddress)
.put('/:id',addressController. updateAddress)
.delete('/:id',addressController. deleteAddress);



module.exports = router