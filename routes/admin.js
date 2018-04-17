const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/adminlogin', function (req, res) {
  res.render('admin/adminlogin');
});

router.post('/adminlogin', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.send(`There was an error: ${err}`);
    } else if (!user) { // User login check failed
      req.flash('danger', 'Email does not exist');
      res.redirect('/admin/adminlogin');
    } else if (!user.isValidPassword(req.body.password)) {
      req.flash('danger', 'Password is incorrect');
      res.redirect('/admin/adminlogin');
    } else if (user.level == 0) {
      req.flash('danger', 'Invalid access');
      res.redirect('/admin/adminlogin');
    } else { // User login
      req.login(user, function (err) {
        if (err) {
          res.send(`There was an error: ${err}`);
        } else {
          req.flash('success', 'You\'re now logged in.');
          res.redirect('/admin/adminhome');
        }
      });
    }
  });
});

router.get('/adminhome', function (req, res) {
  if (req.user) {
    if(req.user.level != 0) {
      res.render('admin/adminhome');
    }    
  } else {
    req.flash('danger', 'Please log in first');
    res.redirect('/admin/adminlogin');
  }
});

router.get('/userlist', function (req, res) {
  if (req.user) {
    if(req.user.level != 0) {
      User.find().exec(function (err, users) {
        if (err) {
          console.log('Error finding users');
          console.error(err);
        } else if (users === []) {
          res.render('admin/userlist', { users: 'You have not made any purchases yet!' });
        } else {
          res.render('admin/userlist', { users: users });
        }
      });
    } 
  } else {
    req.flash('danger', "Please logged in first")
    res.redirect('/admin/adminlogin');
  }
});

router.get('/adpwchange', function (req, res) {
  if (req.user) {
    if(req.user.level != 0) {
      res.render('admin/adpwchange');
    }
  } else {
    req.flash('danger', 'Please log in first');
    res.redirect('/admin/adminlogin');
  }
});

router.post('/adpwchange', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.send(`There was an error: ${err}`);
    } else if (!user) {
      req.flash('danger', 'Email is not correct');
      res.redirect('/admin/adpwchange');
    } else if (!user.isValidPassword(req.body.password)) {
      req.flash('danger', 'Password is not correct');
      res.redirect('/admin/adpwchange');
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
              req.flash('success', "Your password has been changed.");
              res.redirect('/admin/adminhome');
            }
          });
        }
      });
    }
  });
});

router.get('/adminlogout', function (req, res) {
  req.logout();
  req.flash('success', 'You\'ve logged out!');
  res.redirect('/admin/adminlogin');
});

module.exports = router;
