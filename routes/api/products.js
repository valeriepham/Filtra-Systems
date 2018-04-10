const express = require('express');
const router = express.Router();
const productController = require('../../controllers/products.controller');

router.get('/product/:series', productController.findSeries);


module.exports = router;