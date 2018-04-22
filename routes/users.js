const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Order = require('../models/order');
const stripe = require('stripe')('sk_test_uxg0FRXwXVLJidLOj1Xvm6AJ');

router.get('/login', function (req, res) {
  res.render('users/login');
});

router.post('/login', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.send(`There was an error: ${err}`);
    } else if (!user) { // User login check failed
      req.flash('danger', 'Email does not exist');
      res.redirect('/users/login');
    } else if (!user.isValidPassword(req.body.password)) {
      req.flash('danger', 'Password is incorrect');
      res.redirect('/users/login');
    } else { // User login
      req.login(user, function (err) {
        if (err) {
          res.send(`There was an error: ${err}`);
        } else {
          req.flash('success', 'You\'re now logged in.');
          res.redirect('/users/profile');
        }
      });
    }
  });
});

router.get('/profile', function (req, res, next) {
  if (req.user) {
    console.log('user: ', req.user);
    Order.find({ user: req.user._id }).sort({ date: -1 }).exec(function (err, orders) {
      console.log(orders);
      if (err) {
        console.log('Error finding user\'s orders');
        console.error(err);
      } else {
        stripe.customers.retrieve(req.user.customer_id, function(err, customer) {
          console.log(customer.subscriptions.data);
          res.render('users/profile', { orders: orders, subscriptions: customer.subscriptions.data });
        });
      }
    });
  } else {
    req.flash('danger', "Please log in first");
    res.redirect('/users/login');
  }
});


router.get('/signup', function (req, res, next) {
  if (req.user) {
    req.logout();
  }
  res.render('users/signup');
});

router.post('/signup', function (req, res) {
  console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.send(`There was an error: ${err}`);
    } else if (user) { // User already exists
      req.flash('danger', 'Email is already in use');
      res.redirect('/users/signup');
    } else { // User doesn't exist. Save to DB
      const user = new User();
      user.email = req.body.email;
      user.password = user.generateHash(req.body.password);
      stripe.customers.create({
        email: user.email,
        description: 'this customer object is created when a user signs up',

      }, function (err, customer) {
        user.customer_id = customer.id;
        console.log('customer is', customer);
        console.log('customer id is', user.customer_id);
        user.save(function (err) {
          if (err) {
            res.send(`There was an error: ${err}`);
          } else {
            req.login(user, function (err) {
              if (err) {
                res.send(`There was an error: ${err}`);
              } else {
                req.flash('success', 'You\'re now logged in.');
                res.redirect('/users/profile');
              }
            });
          }
        });
      });
    }
  });
});

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'You\'ve logged out!');
  res.redirect('/users/login');
});

router.get('/pwchange', function (req, res) {
  if (req.user) {
    res.render('users/pwchange');
  } else {
    req.flash('danger', 'Please log in first');
    res.redirect('/users/login');
  }
});

router.post('/pwchange', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.send(`There was an error: ${err}`);
    } else if (!user) {
      req.flash('danger', 'Email is not correct');
      res.redirect('/users/pwchange');
    } else if (!user.isValidPassword(req.body.password)) {
      req.flash('danger', 'Password is not correct');
      res.redirect('/users/pwchange');
    } else { // User doesn't exist. Save to DB
      user.password = user.generateHash(req.body.newpassword);
      user.save(function (err) {
        if (err) {
          res.send(`There was an error: ${err}`);
        } else {
          req.login(user, function (err) {
            if (err) {
              res.send(`There was an error: ${err}`);
            } else {
              req.flash('success', 'Your password has been changed.');
              res.redirect('/users/profile');
            }
          });
        }
      });
    }
  });
});

router.get('/payments', function(req, res) {
  stripe.customers.retrieve(req.user.customer_id, function(err, customer) {
    if (err) {
      console.log('Error when retrieving customer:', err);
      res.redirect('profile');
    } else {
      console.log(customer.sources.data);
      res.render('users/payments', {sources: customer.sources.data});
    }
  });
});

router.get('/payments/remove/:id', function(req, res) {
  stripe.customers.deleteSource(req.user.customer_id, req.params.id, function(err, source) {
    if (err) {
      console.log('Error deleting source:', err);
    } else {
      console.log('Source deleted successfully:', source);
      res.redirect('/users/payments');
    }
  });
});

router.put('/payments/update', function(req, res) {

  //Need to implement this still
  
});

router.post('/payments/add-new-card/', function(req, res) {
  console.log(req.body);
  stripe.customers.createSource(req.user.customer_id, {source: req.body.stripeSource }, function(err, source) {
    if(err) {
      console.log('Error creating new source:', err);
    } else {
      console.log('New Source Created:', source);
      stripe.sources.update(source.id, {
        owner: {
          address: {
            line1: req.body.address,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.zip,
            country: 'United States'
          },
          email: req.user.email,
          name: req.body.name
        }}, function(err, source) {
        if (err) {
          console.log('Error updating new source', err);
        } else {
          console.log('New source also updated', source);
          res.redirect('/users/payments');
        }
      });
    }
  });
});

module.exports = router;
