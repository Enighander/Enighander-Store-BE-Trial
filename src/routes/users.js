const express = require('express');
const router = express.Router();
const userController = require ('../controllers/user.js')
// const {protect} = require('../middlewares/auth.js')


router
.get ('/', userController.getAllUser)
.get ('/:id', userController.getUser)
.post ('/register', userController.registerUser)
.post ('/login', userController.loginUser)
.put ('/:id', userController.updateUser)
.post ('/refresh-token', userController.refreshToken)
.get ('/profile',userController.profileUser)
.delete ('/:id', userController.deleteUser);


module.exports = router