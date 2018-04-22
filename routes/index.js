const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');
const cartController = require('../controllers/cart.controller');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');
const stripe = require('stripe')('sk_test_uxg0FRXwXVLJidLOj1Xvm6AJ');
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

router.get('/cart', function (req, res) {
  if (!req.session.cart || req.session.cart == null) {
    return res.render('cart', { products: null, totalPrice: 0 });
  } else {
    let cart = new Cart(req.session.cart);
    res.render('cart', { products: cart.cartItems(), totalPrice: cart.getPrice() });
  }
});

router.get('/checkout', cartController.checkout);

router.post('/charge-user', cartController.chargeUser);

router.get('/guest-checkout', function (req, res) {
  console.log('checkout cart', req.session.cart);
  let cart = new Cart(req.session.cart);
  res.render('guest-checkout', { cart: cart, message: 'If you would like to return to the user checkout page, you may do so <a href="/checkout">here</a>' });
});

router.post('/add-to-cart/:id', cartController.addToCart);

router.post('/charge', cartController.charge);

router.get('/remove-from-cart/:id', cartController.remove);

router.get('/update-quantity/:id/:qty', cartController.updateQuantity);

router.get('/test', function (req, res) {
  res.render('test');
});

router.use('/api/', apiRoutes);

module.exports = router;