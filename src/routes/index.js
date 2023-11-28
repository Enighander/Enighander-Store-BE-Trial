const express = require('express');
const router = express.Router();
const productRouter = require('../routes/products.js');
const categoryRouter = require('../routes/categories.js');
const userRouter = require('../routes/users.js');
const orderRouter = require('../routes/order.js');
const addressRouter = require('../routes/address.js');
const deliverRouter = require('../routes/delivery.js');
const bankRouter= require('../routes/bank.js');
const adminsRouter = require('../routes/admins.js');
const paymentRouter = require('../routes/payment.js');
// const {protect} = require('../middlewares/auth.js');

router
.use('/products', productRouter)
.use('/categories', categoryRouter)
.use('/user', userRouter)
.use('/orders', orderRouter)
.use('/address', addressRouter)
.use('/delivery', deliverRouter)
.use('/bank', bankRouter)
.use('/admin', adminsRouter)
.use('/payment', paymentRouter);


module.exports = router
