const express = require('express');
const router = express.Router();
const adminController = require ('../controllers/admin.js')



router
.get ('/', adminController.getAllAdmin)
.get ('/:id', adminController.getAdmin)
.post ('/create', adminController.registerAdmin)
.post ('/login', adminController.loginAdmin)
.put ('/:id', adminController.updateAdmin)
.post ('/refresh-token', adminController.refreshToken)
.get ('/profile', adminController.profileAdmin)
.delete ('/:id', adminController.deleteAdmin);


module.exports = router