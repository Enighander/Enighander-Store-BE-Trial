const express = require ('express')
const router = express.Router();
const bankController = require ('../controllers/bank.js');
const uploadBank = require('../middlewares/uploadBank.js');



router
.get('/', bankController.getAll)
.post('/',uploadBank, bankController.insertBank)
.delete('/:id', bankController. deleteBank);


module.exports = router