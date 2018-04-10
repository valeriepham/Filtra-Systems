const Cart = require('../models/cart');
const Order = require('../models/order');
const Product = require('../models/product');
const Stripe = require('stripe');

function addToCart(req, res) {
  let series = req.body.model;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  console.log('adding', series, 'to cart');

  Product.findOne({ model: series }).exec(function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    console.log('product found:', product);
    let qty = parseInt(req.body.qty, 10);
    cart.add(product, product.id, qty || 1);
    req.session.cart = cart;
    res.redirect('/cart');
  });
}

function updateQuantity(req, res) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  //create a new cart object from the saved cart in session memory
  let id = req.params.id;
  let qty = req.params.qty;
  let cart = new Cart(req.session.cart);
  console.log(cart.cartItems());
  cart.updateQuantity(id, qty);
  console.log(cart.cartItems());
  res.redirect('/cart');
}

function update(req, res) {
  let cart = new Cart(req.body);
  console.log('passed cart:',cart);
  console.log('session cart:',req.session.cart);
  req.session.cart = cart;
  console.log('updated cart:',req.session.cart);
  res.redirect('/cart');
}

function remove(req, res) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  //create a new cart object from the saved cart in session memory
  let id = req.params.id;
  let cart = new Cart(req.session.cart);
  cart.remove(id);
  res.redirect('/cart');
}

function charge(req, res) {
  //ensure that the cart is still saved in session memory
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  //create a new cart object from the saved cart in session memory
  let cart = new Cart(req.session.cart);

  // Set stripe key to secret test key (test version)
  let stripe = Stripe('sk_test_uxg0FRXwXVLJidLOj1Xvm6AJ');

  // Token is created using Elements
  // Get the payment token ID submitted by the form:
  let token = req.body.stripeToken; // Using Express

  // Charge the user's card:
  stripe.charges.create({
    amount: cart.getPrice() * 100,
    currency: 'usd',
    description: 'Test Charge',
    source: token,
  }, function (err, charge) {
    // asynchronously called
    if (err) {
      req.flash('danger', err.message);
      return res.redirect('/simplecheckout');
    }
    let order = new Order({
      user: req.user ? req.user : null,
      cart: cart,
      shippingAddress: {
        street: req.body.shippingAdd,
        state: req.body.shippingSt,
        zip: req.body.shippingZip,
      },
      billingAddress: {
        street: req.body.billingAdd,
        state: req.body.billingSt,
        zip: req.body.billingZip,
      },
      name: req.body.cardHolderName,
      paymentId: charge.id,
    });
    order.save(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'Checkout was successful!');
        req.session.cart = null;
        res.redirect('/cart');
      }
    });
  });
}

module.exports = { addToCart, updateQuantity, update, remove, charge };