const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller');
const Cart = require('../../models/cart');

router.get('/save', function(req, res) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  res.redirect('checkout');
});

router.get('/', function (req, res) {
  if (!req.session.cart || req.session.cart == null) {
    res.send('cart empty');
  } else {
    let cart = new Cart(req.session.cart);
    res.send(cart);
  }
});

router.post('/add', cartController.addToCart);

router.post('/charge', cartController.charge);

router.get('/remove-from-cart/:id', cartController.remove);

router.get('/update-quantity/:id/:qty', cartController.updateQuantity);

router.put('/update', cartController.update);


module.exports = router;