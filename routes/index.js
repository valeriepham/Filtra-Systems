let express = require('express');
let router = express.Router();
let controller = require('../controller/products.controller');
let Cart = require('../models/cart');
const PRODUCT = require('../models/product');
let Order = require('../models/order');
let Stripe = require('stripe');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home');
});

router.get('/about-us', function(req, res, next) {
  res.render('about-us', { title: 'About Us', message: 'More information to come soon!' });
});

router.get('/request-quote', function(req, res, next) {
  res.render('request-quote', { title: 'Request Quote', message: 'More information to come soon!' });
});

router.get('/contact-us', function(req, res, next) {
  res.render('contact-us', { title: 'Contact Us', message: 'More information to come soon!' });
});

// router.get('/checkout', function (req, res, next) {
//   res.render('index', { title: 'Checkout', message: 'This is Filtrasystems beautiful cart.' });
// });

router.get('/product/:series', controller.findSeries);

router.get('/home', function (req, res, next) {
  res.redirect('../newhomepage.html');
});

router.get('/cart', function (req, res, next) {
  if (!req.session.cart || req.session.cart == null) {
    return res.render('cart', { products: null, totalPrice: 0 });
  }
  let cart = new Cart(req.session.cart);
  res.render('cart', { products: cart.cartItems(), totalPrice: cart.price() });
});

router.get('/simplecheckout', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  let cart = new Cart(req.session.cart);
  res.render('simplecheckout', { totalPrice: cart.price() });
});

router.post('/cart/:id', function(req, res, next) {
  let series = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  PRODUCT.findOne({ 'series': series }).exec(function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    let qty = parseInt(req.body.qty, 10);
    cart.add(product, product.id, qty || 1);
    req.session.cart = cart;
    // console.log(req.session.cart)
    // console.log(req.session.cart.cartItems());
    res.redirect('/cart');
  });

});

router.post('/charge', function (req, res, next) {
  //ensure that the cart is still saved in session memory
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  //create a new cart object from the saved cart in session memory
  let cart = new Cart(req.session.cart);

  // Set stripe key to secret test key (test version)
  let stripe = Stripe("sk_test_uxg0FRXwXVLJidLOj1Xvm6AJ");

  // Token is created using Elements
  // Get the payment token ID submitted by the form:
  let token = req.body.stripeToken; // Using Express

  // Charge the user's card:
  stripe.charges.create({
    amount: cart.price() * 100,
    currency: "usd",
    description: "Test Charge",
    source: token,
  }, function (err, charge) {
    // asynchronously called
    if (err) {
      req.flash('danger', err.message);
      return res.redirect('/simplecheckout');
    }
    let order = new Order({
      user: req.user || null,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id,
    });
    order.save(function(err, result) {
      req.flash('success', 'Checkout was successful!');
      req.session.cart = null;
      res.redirect('/cart');    
    });
  });
});

router.get('/remove-from-cart/:id', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  //create a new cart object from the saved cart in session memory
  let id = req.params.id
  let cart = new Cart(req.session.cart);
  cart.remove(id);
  res.redirect('/cart')
});

router.get('/update-quantity/:id', function (req, res, next) {

});

module.exports = router;