let express = require('express');
let router = express.Router();
let controller = require('../controller/products.controller');
let Cart = require('../models/cart');


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
  res.render('homepage_2');
});

router.get('/add-to-cart', function (req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  
  PRODUCT.find({ 'series': series }).exec(function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart)
    res.redirect('/');
  });
});


module.exports = router;