const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/login', function (req, res) {
  res.render('users/login');
});

router.post('/login', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.send(`There was an error: ${err}`);
    } else if (!user) { // User already exists
      req.flash('danger', 'Email or Password is incorrect');
      res.redirect('/users/login');
    } else { // User doesn't exist. Save to DB
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

router.get('/profile', function (req, res) {
  console.log('user', req.user);
  console.log('orders', req.user.pullOrders());
  req.user.pullOrders().then(function (orders) {
    console.log('then orders', orders);
    res.render('users/profile', { orders: orders });
  });  
});

router.get('/signup', function (req, res) {
  res.render('users/signup');
});

router.post('/signup', function (req, res) {
  console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.send(`There was an error: ${err}`);
    } else if (user) { // User already exists
      req.flash('danger', 'Email or password is already in use');
      res.redirect('/users/signup');
    } else { // User doesn't exist. Save to DB
      const user = new User();
      user.email = req.body.email;
      user.password = user.generateHash(req.body.password);
      user.level = req.body.level;
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
    }
  });
});

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'You\'ve logged out!');
  res.redirect('/users/login');
});

module.exports = router;
