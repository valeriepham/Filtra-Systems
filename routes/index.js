const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');
const cartController = require('../controllers/cart.controller');
const Cart = require('../models/cart');
const Product = require('../models/product');
// const Order = require('../models/order');
// const Stripe = require('stripe');


/* GET home page. */
router.get('/', function (req, res) {
  res.render('home');
});

router.get('/about-us', function (req, res) {
  res.render('about-us', { title: 'About Us', message: 'More information to come soon!' });
});

router.get('/request-quote', function (req, res) {
  res.render('request-quote', { title: 'Request Quote', message: 'More information to come soon!' });
});

router.get('/contact-us', function (req, res) {
  res.render('contact-us', { title: 'Contact Us', message: 'More information to come soon!' });
});

// router.get('/checkout', function (req, res) {
//   res.render('index', { title: 'Checkout', message: 'This is Filtrasystems beautiful cart.' });
// });

router.get('/product/:series', productController.findSeries);

// router.get('/home', function (req, res) {
//   res.redirect('../newhomepage.html');
// });

router.get('/cart', function (req, res) {
  if (!req.session.cart || req.session.cart == null) {
    return res.render('newcart', { products: null, totalPrice: 0 });
  } else {
    console.log('req cart', req.session.cart);
    let cart = new Cart(req.session.cart);
    console.log('cart object', cart);
    console.log('price', cart.price());
    res.render('newcart', { products: cart.cartItems(), totalPrice: cart.price() });
  }
});

router.get('/simplecheckout', function (req, res) {
  if (!req.session.cart) {
    console.log('no cart in session');
    return res.redirect('/cart');
  }
  console.log('checkout cart', req.session.cart);
  let cart = new Cart(req.session.cart);
  res.render('simplecheckout', { totalPrice: cart.price() });
});

router.get('/api/cart/save', function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  let cart = new Cart(req.session.cart);
  res.render('simplecheckout', { totalPrice: cart.price() });
})

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
});

router.put('/api/cart/update', function (req, res) {
  if (!req.session.cart || req.session.cart == null) {
    console.log('cart empty');
    res.send('cart empty');
  } else {
    console.log('session cart', req.session.cart);
    req.session.cart = new Cart(req.body);
    console.log('session cart updated', req.session.cart);
    res.send(req.session.cart);
  }
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

module.exports = router;