const PRODUCT = require('../models/products');

function listProducts(req, res) {
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
};

function findModel(req, res) {
  let series = req.params.series;
  PRODUCT.find({ 'series': series }).exec(function (err, product) {
    console.log(series);
    if (err) {
      console.log('Error when fetching product');
      res.render('500', { err: err });
    }
    else {
      res.render('products', {
        title: 'Product Page',
        products: product
      });
    }
  });
};

module.exports = { listProducts, findModel };