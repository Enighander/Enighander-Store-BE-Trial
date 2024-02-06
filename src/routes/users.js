const express = require('express');
const router = express.Router();
const userController = require ('../controllers/user.js')
const {multerUpdateUserData, uploadUser, uploadToCloudinary} = require ('../middlewares/uploadUser.js')

router
.get ('/', userController.getAllUser)
.get ('/:id', userController.getUser)
.post ('/register', userController.registerUser)
.post ('/login', userController.loginUser)
.put ('/:id/updateUserData', multerUpdateUserData, userController.updateUser)
.put ('/:id/change-password',userController.updateUserPassword)
.put ('/:id/updateUserImage',uploadUser,uploadToCloudinary,userController.updateUserImage)
.post ('/refresh-token', userController.refreshToken)
.get ('/profile',userController.profileUser)
.delete ('/:id', userController.deleteUser);


module.exports = router