const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');
const cartController = require('../controllers/cart.controller');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');
const Stripe = require('stripe');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home');
});

router.get('/about-us', function (req, res, next) {
  res.render('about-us', { title: 'About Us', message: 'More information to come soon!' });
});

router.get('/request-quote', function (req, res, next) {
  res.render('request-quote', { title: 'Request Quote', message: 'More information to come soon!' });
});

router.get('/contact-us', function (req, res, next) {
  res.render('contact-us', { title: 'Contact Us', message: 'More information to come soon!' });
});

// router.get('/checkout', function (req, res, next) {
//   res.render('index', { title: 'Checkout', message: 'This is Filtrasystems beautiful cart.' });
// });

router.get('/product/:series', productController.findSeries);

router.get('/home', function (req, res, next) {
  res.redirect('../newhomepage.html');
});

router.get('/cart', function (req, res, next) {
  if (!req.session.cart || req.session.cart == null) {
    return res.render('newcart', { products: null, totalPrice: 0 });
  } else {
    let cart = new Cart(req.session.cart);
    res.render('newcart', { products: cart.cartItems(), totalPrice: cart.price() });
  }
});

router.get('/simplecheckout', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  let cart = new Cart(req.session.cart);
  res.render('simplecheckout', { totalPrice: cart.price() });
});

router.post('/add-to-cart/:id', cartController.addToCart);

router.post('/charge', cartController.charge);

router.get('/remove-from-cart/:id', cartController.remove);

router.get('/update-quantity/:id/:qty', cartController.updateQuantity);

router.get('/test', function (req, res) {
  res.render('test');
});

router.get('/api/cart', function (req, res) {
  if (!req.session.cart || req.session.cart == null) {
    res.send('cart empty');
  } else {
    let cart = new Cart(req.session.cart);
    res.send(cart);
  }
})

router.get('/api/cart/update', function (req, res) {
  if (!req.session.cart || req.session.cart == null) {
    res.send('cart empty');
  } else {
    res.send('cart updated');
  }
})



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

module.exports = router;