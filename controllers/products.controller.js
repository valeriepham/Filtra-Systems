const Product = require('../models/product');

function listProducts(req, res) {
  Product.find().exec(function (err, products) {
    if (err) {
      console.log('Error when fetching products');
      res.render('500', { err: err });
    }
    else {
      res.render('product', {
        title: 'Products',
        products: products
      });
    }
  });
}

function findSeries(req, res) {
  let series = req.params.series;
  Product.find({ 'series': series }).exec(function (err, product) {
    console.log(series);
    if (err) {
      console.log('Error when fetching product');
      res.render('500', { err: err });
    }
    else {
      res.render('product', {
        title: series + 'Product Page',
        products: product
      });
    }
  });
}

function subscriptions(req, res) {
  let series = req.params.series;
  Product.find({ 'series': series }).exec(function (err, product) {
    console.log(series);
    if (err) {
      console.log('Error when fetching product');
      res.render('500', { err: err });
    }
    else {
      res.render('subscriptions', {
        title: series + ' subscriptions',
        products: product
      });
    }
  });
}

module.exports = { listProducts, findSeries, subscriptions };