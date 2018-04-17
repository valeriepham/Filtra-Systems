const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');
const cartController = require('../controllers/cart.controller');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');
// const Stripe = require('stripe');
const apiRoutes = require('./api');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('home');
});

router.get('/about-us', function (req, res) {
  res.render('site-info/about-us', { title: 'About Us', message: 'More information to come soon!' });
});

router.get('/request-quote', function (req, res) {
  res.render('site-info/request-quote', { title: 'Request Quote', message: 'More information to come soon!' });
});

router.get('/contact-us', function (req, res) {
  res.render('site-info/contact-us', { title: 'Contact Us', message: 'More information to come soon!' });
});

router.get('/product/:series', productController.findSeries);

router.get('/cart', function (req, res) {
  if (!req.session.cart || req.session.cart == null) {
    return res.render('cart', { products: null, totalPrice: 0 });
  } else {
    let cart = new Cart(req.session.cart);
    res.render('cart', { products: cart.cartItems(), totalPrice: cart.getPrice() });
  }
});

router.get('/simplecheckout', function (req, res) {
  if (!req.session.cart) {
    console.log('no cart in session');
    return res.redirect('/cart');
  }
  console.log('checkout cart', req.session.cart);
  let cart = new Cart(req.session.cart);
  res.render('simplecheckout', { totalPrice: cart.getPrice() * 1.2375 });
});

router.get('/api/cart/save', function(req, res) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  let cart = new Cart(req.session.cart);
  res.render('simplecheckout', { totalPrice: cart.getPrice() });
});

router.post('/add-to-cart/:id', cartController.addToCart);

router.post('/charge', cartController.charge);

router.get('/remove-from-cart/:id', cartController.remove);

router.get('/update-quantity/:id/:qty', cartController.updateQuantity);

router.get('/test', function (req, res) {
  res.render('test');
});

router.get('/api/products', function (req, res) {
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

router.get('api/orders/user/:uid', function(req, res) {
  Order.find({ user: req.params.uid }).exec(function (err, orders) {
    if (err) {
      console.log('Error when fetching orders');
      res.status(400).send(err);
    } else {
      console.log('Orders:', orders);
      res.status(200).send(orders);
    }
  });
});

router.use('/api/', apiRoutes);

module.exports = router;