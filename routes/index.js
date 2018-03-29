let express = require('express');
let router = express.Router();
let controller = require('../controller/products.controller');
let Cart = require('../models/cart');
const PRODUCT = require('../models/product');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('newhomepage');
});

router.get('/checkout', function (req, res, next) {
  res.render('index', { title: 'Checkout', message: 'This is Filtrasystems beautiful cart.' });
});

router.get('/product/:series', controller.findSeries);

router.get('/cart', function (req, res, next) {
  res.redirect('../Cart.html');
});

router.get('/home', function (req, res, next) {
  res.redirect('../newhomepage.html');
});

router.get('/add-to-cart/:id', function (req, res, next) {
  let series = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  PRODUCT.findOne({ 'series': series }).exec(function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    // console.log(req.session.cart)
    // console.log(req.session.cart.cartItems());
    res.redirect('/');
  });
});

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('simplecart', { products: null });
  }
  let cart = new Cart(req.session.cart);
  // console.log(cart);
  // console.log(cart.cartItems());
  res.render('simplecart', { products: cart.cartItems(), totalPrice: cart.price() });
});

router.get('/simplecheckout', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  let cart = new Cart(req.session.cart);
  res.render('simplecheckout', { totalPrice: cart.price() });
})

router.post('/checkout', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  let stripe = Stripe('sk_test_uxg0FRXwXVLJidLOj1Xvm6AJ');

})

module.exports = router;