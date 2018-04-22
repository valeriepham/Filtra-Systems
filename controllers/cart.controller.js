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
    console.log('charge:', charge);
    let order = new Order({
      user: req.user ? req.user : null,
      cart: cart,
      email: req.body.email,
      shippingAddress: {
        street: req.body.address,
        state: req.body.state,
        city: req.body.city,
        zip: charge.source.address_zip,
      },
      billingAddress: {
        street: req.body.address,
        state: req.body.state,
        city: req.body.city,
        zip: charge.source.address_zip,
      },
      name: req.body.cardName,
      paymentId: charge.id,
    });
    order.save(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('order:',result);
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
    stripe.customers.retrieve(req.user.customer_id, function(err, customer) {
      if (err) {
        console.log('Error when retrieving customer', err);
      }
      else {
        let source = customer.sources.data.find(card => card.id === token);
        console.log('source:', source);
        let order = new Order({
          user: req.user ? req.user : null,
          cart: cart,
          email: source.owner.email,
          shippingAddress: {
            street: source.owner.address.line1,
            state: source.owner.address.state,
            city: source.owner.address.city,
            zip: source.owner.address.postal_code,
          },
          billingAddress: {
            street: source.owner.address.line1,
            state: source.owner.address.state,
            city: source.owner.address.city,
            zip: source.owner.address.postal_code,
          },
          name: source.owner.name,
          paymentId: charge.id,
        });
        order.save(function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('order:',result);
            req.flash('success', 'Checkout was successful!');
            req.session.cart = null;
            res.render('confirm', { cart: cart, reorder: false });
          }
        });
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