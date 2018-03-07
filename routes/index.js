var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/cart',function(req, res, next){
  res.redirect('../Cart.html');
});
module.exports = router;
