const express = require ('express')
const router = express.Router();
const deliveryController = require('../controllers/delivery.js')

router
.get('/',deliveryController.getAll)
.post('/delivery',deliveryController.insertDelivery);




module.exports = router