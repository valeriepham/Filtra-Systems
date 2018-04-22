const Cart = require('../models/cart');
const Order = require('../models/order');
const Product = require('../models/product');
const stripe = require('stripe')('sk_test_uxg0FRXwXVLJidLOj1Xvm6AJ');

function addToCart(req, res) {
  let model = req.body.model;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  console.log('adding', model, 'to cart');

  Product.findOne({ model: model }).exec(function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    console.log('product found:', product);
    let qty = parseInt(req.body.qty, 10);
    if (qty < 1) {
      qty = 1;
    }
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
  console.log('passed cart:', cart);
  console.log('session cart:', req.session.cart);
  req.session.cart = cart;
  console.log('updated cart:', req.session.cart);
  res.send(cart);
  // res.redirect('/cart');
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

  // Token is created using Elements
  // Get the payment token ID submitted by the form:
  let token = req.body.stripeToken; // Using Express

  // Charge the user's card:
  stripe.charges.create({
    amount: parseInt(cart.getPrice() * 100),
    currency: 'usd',
    description: 'Test Charge',
    source: token,
  }, function (err, charge) {
    // asynchronously called
    if (err) {
      req.flash('danger', err.message);
      return res.redirect('/checkout');
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
        console.log(result);
        req.flash('success', 'Checkout was successful!');
        req.session.cart = null;
        res.render('confirm', { cart: cart, reorder: false });
      }
    });
  });
}

function chargeUser(req, res) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  let cart = new Cart(req.session.cart);
  let token = req.body.method;
  stripe.charges.create({
    amount: parseInt(cart.getPrice() * 1.2375 * 100),
    currency: 'usd',
    description: 'test user charge',
    customer: req.user.customer_id,
    source: token
  }, function (err, charge) {
    if (err) {
      console.log('Error when creating charge', err);
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
        console.log(result);
        req.flash('success', 'Checkout was successful!');
        req.session.cart = null;
        res.render('confirm', { cart: cart, reorder: false });
      }
    });
  });
}
function subscribe(req, res) {
  console.log(req.body);
  res.render('review-subscription', { subscription: req.body });
}

function chargeSubscription(req, res) {
  console.log(req.body);
  
  res.redirect('/users/profile');
}

module.exports = { addToCart, updateQuantity, update, remove, charge, chargeUser, subscribe, chargeSubscription };