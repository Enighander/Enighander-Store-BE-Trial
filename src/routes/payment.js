const express = require ('express')
const router = express.Router();
const paymentController = require('../controllers/payment.js');

router
.get('/',paymentController.getAllPayment)
.get('/user/:user_id',paymentController.getPaymentByUserId)
.get('/:id',paymentController.getPaymentById)
.post('/',paymentController.createPayment)
.delete('/:id',paymentController.delete);




module.exports = router