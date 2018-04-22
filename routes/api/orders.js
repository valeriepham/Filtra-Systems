const express = require('express');
const router = express.Router();

const Cart = require('../../models/cart');
const Order = require('../../models/order');

router.get('/review/:id', function(req, res) {
  let id = req.params.id;
  console.log(id);
  Order.findOne({ _id: id }).exec(function(err, order) {
    if (err) {
      console.log('Error fetching order', err);
      res.send('Error');
    } else {
      console.log('Order found', order);
      let cart = new Cart(order.cart);
      console.log('date', order.date.getMonth());
      res.render('confirm', {cart: cart, reorder: order});
    }
  });
});

router.get('/reorder/:id', function(req, res) {
  let id = req.params.id;
  console.log(id);
  Order.findOne({ _id: id }).exec(function(err, order) {
    if (err) {
      console.log('Error fetching order', err);
      res.send('Error');
    } else {
      console.log('Order found', order);
      let cart = new Cart(order.cart);
      req.session.cart = cart;
      res.redirect('/cart');
    }
  });
});

router.get('/user/:uid', function(req, res) {
  Order.find({ user: req.params.uid }).exec(function (err, orders) {
    if (err) {
      console.log('Error when fetching orders');
      res.status(400).send(err);
    } else {
      console.log('Orders:', orders);
      res.status(200).send(orders);
    }
  });
});

module.exports = router;