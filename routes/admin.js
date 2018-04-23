const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Order = require('../models/order');

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
    } else if (user.level === 0) {
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
    if(req.user.level !== 0) {
      res.render('admin/adminhome');
    }    
  } else {
    req.flash('danger', 'Please log in first');
    res.redirect('/admin/adminlogin');
  }
});

router.get('/userlist', function (req, res) {
  if (req.user) {
    if(req.user.level !== 0) {
      User.find().sort({email: 1}).exec(function (err, users) {
        if (err) {
          console.log('Error finding users', err);
        } else if (users === []) {
          res.render('admin/userlist', { users: 'You have not made any purchases yet!' });
        } else {
          res.render('admin/userlist', { users: users });
        }
      });
    } 
  } else {
    req.flash('danger', 'Please logged in first');
    res.redirect('/admin/adminlogin');
  }
});

router.get('/adpwchange', function (req, res) {
  if (req.user) {
    if(req.user.level !== 0) {
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
              req.flash('success', 'Your password has been changed.');
              res.redirect('/admin/userlist');
            }
          });
        }
      });
    }
  });
});

router.get('/userpwmanage/:email', function (req, res) {
  if (req.user) {
    if(req.user.level !== 0) {
      User.findOne({email: req.params.email}).exec(function (err, tuser) {
        if (err) {
          console.log('Error finding users', err);
        } else{
          res.render('admin/userpwmanage', { tuser: tuser });        
        }
      });
    } 
  } else {
    req.flash('danger', 'Please log in first');
    res.redirect('/admin/adminlogin');
  }
});

router.post('/userpwmanage/:email', function (req, res) {
  if (req.user) {
    if(req.user.level !== 0) {
      User.findOne({email: req.params.email}, function (err, tuser) {
        if (err) {
          console.log('Error finding users', err);
        } else {
          tuser.password = tuser.generateHash(req.body.newpassword);
          tuser.save(function (err) {
            if (err) {
              res.send(`There was an error: ${err}`);
            } else {
              req.flash('success', 'User Password Has been Changed');
              res.redirect('/admin/userlist');            
            }
          });      
        }
      });
    } 
  } else {
    req.flash('danger', 'Please log in first');
    res.redirect('/admin/adminlogin');
  }
});

router.get('/aduserdelete/:email', function (req, res) {
  if (req.user) {
    if(req.user.level !== 0) {
      User.find().exec(function (err, users) {
        if (err) {
          console.log('Error finding users', err);
        } else{
          let tuser = User.findOne({email: req.params.email});
          Order.findOne({user: tuser._id}).remove().exec();
          User.findOne({ email: req.params.email }).remove().exec();
          req.flash('success', 'User has been deleted');
          res.redirect('/admin/userlist');          
        }
      });
    } 
  } else {
    req.flash('danger', 'Please log in first');
    res.redirect('/admin/adminlogin');
  }
  
});

router.get('/adminlogout', function (req, res) {
  req.logout();
  req.flash('success', 'You\'ve logged out!');
  res.redirect('/admin/adminlogin');
});

router.get('/order-mgt/:page', function(req, res) {
  if (req.user) {
    if (req.user.level !== 0) {
      Order.find().sort({date: -1}).exec(function(err, orders) {
        if (err) {
          console.log('Error finding Orders', err);
          res.send(err);
        } else {
          let page = parseInt(req.params.page);
          let morePages = true;
          orders = orders.slice((page - 1) * 10, page * 10);
          if (orders.length < 10) morePages = false;
          res.render('admin/order-mgt', {orders: orders, page: page, morePages: morePages});
        }
      });
    }
  } else {
    res.redirect('/adminlogin');
  }
});

module.exports = router;
