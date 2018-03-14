let express = require('express');
let router = express.Router();
let controller = require('../controller/products.controller');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home', message: 'This is Filtrasystems beautiful homepage.' });
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

module.exports = router;