var express = require('express');
var router = express.Router();
const PRODUCT = require('../models/products');

/* GET home page. */
router.get('/', function (req, res, next) {
  PRODUCT.find().exec(function (err, products) {
    if (err) {
      console.log('Error when fetching products');
      res.render('500', { err: err });
    }
    else {
      res.render('products', {
        title: 'PRODUCTS',
        products: products
      });
    }
  });
});

module.exports = router;