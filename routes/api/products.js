const express = require('express');
const router = express.Router();
const productController = require('../../controllers/products.controller');
const Product = require('../../models/product');

router.get('/product/:series', productController.findSeries);

router.get('/', function (req, res) {
  Product.find().exec(function (err, products) {
    if (err) {
      console.log('Error when fetching products');
      res.render('500', { err: err });
    }
    else {
      res.send(products);
    }
  });
});


module.exports = router;