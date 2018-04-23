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
  cart.updateQuantity(id, qty);
  res.redirect('/cart');
}

function update(req, res) {
  let cart = new Cart(req.body);
  req.session.cart = cart;
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

function checkout(req, res) {
  if (!req.session.cart) {
    console.log('No cart in session');
    return res.redirect('/cart');
  }
  let cart = new Cart(req.session.cart);
  if (!req.user) {
    console.log('guest checkout');
    res.render('guest-checkout', { cart: cart, message: 'If you would like to save this order, please <a href="/users/login">login</a>, or <a href="/users/signup">signup</a> for an account first.' });  
  } else {
    console.log('user checkout');
    stripe.customers.retrieve(req.user.customer_id, function(err, customer) {
      if (err) {
        console.log('Error when retrieving customer:', err);
        res.render('profile');
      } else {
        res.render('user-checkout', {cart: cart, sources: customer.sources.data});
      }
    });
  }
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
  res.render('review-subscription', { subscription: req.body });
}

function chargeSubscription(req, res) {
  res.redirect('/users/profile');
}

module.exports = { 
  addToCart,
  updateQuantity,
  update,
  remove,
  charge,
  checkout,
  chargeUser,
  subscribe,
  chargeSubscription
};