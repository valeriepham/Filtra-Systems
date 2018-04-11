const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Order = require('../models/order');

router.get('/login', function(req, res) {
  res.render('users/login');
});

router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if(err) {
      res.send(`There was an error: ${err}`);
    } else if(!user) { // User login check failed
      req.flash('danger', 'Email does not exist');
      res.redirect('/users/login');
    } else if (!user.isValidPassword(req.body.password)) {
      req.flash('danger', 'Password is incorrect');
      res.redirect('/users/login');
    } else { // User login
      req.login(user, function(err) {
        if(err) {
          res.send(`There was an error: ${err}`);
        } else {
          req.flash('success', "You're now logged in.");
          res.redirect('/users/profile');
        }
      });
    }
  });
});

router.get('/profile', function(req, res, next) {
  if(req.user) {
    console.log('user: ', req.user);
      Order.find({ user: req.user._id }).exec(function(err, orders) {
        if (err) {
          console.log('Error finding user\'s orders');
          console.error(err);
        } else if (orders === []) {
          res.render('users/profile', { orders: 'You have not made any purchases yet!' });
        } else {
          res.render('users/profile', { orders: orders });
        }
      });
  } else {
    req.flash('danger',"Please logged in first")
    res.redirect('/users/login');
  }
});


router.get('/signup', function(req, res, next) {
  if(req.user) {
    req.logout();
  }
  res.render('users/signup');
});

router.post('/signup', function(req, res) {
  console.log(req.body);
  User.findOne({email: req.body.email}, function(err, user) {
    if(err) {
      res.send(`There was an error: ${err}`);
    } else if(user) { // User already exists
      req.flash('danger', 'Email is already in use');
      res.redirect('/users/signup');
    } else { // User doesn't exist. Save to DB
      const user = new User();
      user.email = req.body.email;
      user.password = user.generateHash(req.body.password);
      user.level = 0;
      user.save(function(err) {
        if(err) {
          res.send(`There was an error: ${err}`);
        } else {
          req.login(user, function(err) {
            if(err) {
              res.send(`There was an error: ${err}`);
            } else {
              req.flash('success', "You're now logged in.");
              res.redirect('/users/profile');
            }
          });
        }
      });
    }
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', "You've logged out!");
  res.redirect('/users/login');
});

router.get('/pwchange', function(req, res) {
  if(req.user) {
    res.render('users/pwchange');
  } else {
    req.flash('danger',"Please logged in first")
    res.redirect('/users/login');
  }
});

router.post('/pwchange', function(req, res) {
  User.findOne({email: req.body.email }, function(err, user) {
    if(err) {
      res.send(`There was an error: ${err}`);
    } else if(!user) { 
      req.flash('danger', 'Email is not correct');
      res.redirect('/users/pwchange');
    } else if(!user.isValidPassword(req.body.password)) {
      req.flash('danger', 'Password is not correct');
      res.redirect('/users/pwchange');      
    } else{ // User doesn't exist. Save to DB
      user.password = user.generateHash(req.body.newpassword);
      user.save(function(err) {
        if(err) {
          res.send(`There was an error: ${err}`);
        } else {
          req.login(user, function(err) {
            if(err) {
              res.send(`There was an error: ${err}`);
            } else {
              req.flash('success', "Your password has been changed.");
              res.redirect('/users/profile');
            }
          });
        }
      });
    }
  });
});

module.exports = router;
