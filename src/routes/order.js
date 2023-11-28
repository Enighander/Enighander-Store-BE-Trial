const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.js')

router
.get("/", orderController.getAllOrder)
.get("/:admin_id", orderController.getOrderById)
.get("/user/:user_id", orderController.getOrderByUserId)
.get("/user/:user_id/:status_orders", orderController.getStatusByUserId)
.get("/admin/:admin_id/:status_orders", orderController.getStatusByAdminId)
.put("/:id/processed",orderController.updateStatusProcessed)
.put("/:id/sent",orderController.updateStatusSent)
.put("/:id/complete",orderController.updateStatusCompleted)
.put("/:id/cancel",orderController.updateStatusCanceled)
.put("/:id", orderController.update)
.post("/", orderController.insert)
.delete("/:id", orderController.delete)
.delete("/", orderController.deleteAll);




module.exports = router