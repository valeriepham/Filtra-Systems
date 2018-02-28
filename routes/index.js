var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', message: 'This is Filtrasystems beautiful homepage.' });
});

router.get('/checkout', function(req, res, next) {
  res.render('index', { title: 'Checkout', message: 'This is Filtrasystems beautiful cart.' });
});

router.get('/product', function(req, res, next) {
  res.render('product', { 
  price: '100', 
  name: 'name',
  image: 'http://www.fsbagfilter.com/wp-content/uploads/2016/06/FSC1-Dim.jpg',
  description: 'description',
  features: 'features',
  series: 'series',
  modelnum: 'model',
  quantity: 'quantity',
  size: 'size',
  material: 'material',
  pressure: 'pressure',
  inletoutlet: 'inletoutlet',
  type: 'type'
});
});

module.exports = router;
