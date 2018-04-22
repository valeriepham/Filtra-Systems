const Product = require('../models/product');
const stripe = require('stripe')('sk_test_uxg0FRXwXVLJidLOj1Xvm6AJ');

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
  Product.find({ 'series': series }).exec(function (err, products) {
    console.log(series);
    if (err) {
      console.log('Error when fetching product');
      res.render('500', { err: err });
    }
    else {
      if (series[2] === 'F') {
        res.render('bag', {
          title: series + 'Product Page',
          bag: products[0]
        });
      } else {
        res.render('product', {
          title: series + 'Product Page',
          products: products
        });  
      }
    }
  });
}

function findBagSeries(req, res) {
  let series = req.params.series;
  Product.findOne({ 'series': series }).exec(function (err, product) {
    console.log(series);
    if (err) {
      console.log('Error when fetching product');
      res.render('500', { err: err });
    }
    else {
      if (series[2] === 'F') {
        res.render('bag', {
          title: series + 'Product Page',
          bag: product
        });
      } else {
        res.render('product', {
          title: series + 'Product Page',
          products: product
        });  
      }
    }
  });
}

function subscriptions(req, res) {
  if (!req.user) {
    res.render('subscriptions', { title: 'Subscriptions', user: false });
  } else {
    let model = req.params.model;
    Product.findOne({ 'model': model }).exec(function (err, product) {
      console.log(product);
      if (err) {
        console.log('Error when fetching product');
        res.render('500', { err: err });
      }
      else {
        stripe.customers.retrieve(req.user.customer_id, function (err, customer) {
          if (err) {
            console.log('Error when retrieving customer:', err);
            res.redirect('/users/payments');
          } else {
            console.log(customer.sources.data);
            res.render('subscriptions', {
              title: product.title + ' Subscriptions',
              user: req.user,
              sources: customer.sources.data,
              product: product
            });
          }
        });
      }
    });
  }
}

module.exports = { listProducts, findSeries, findBagSeries, subscriptions };