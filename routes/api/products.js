const express = require('express');
const router = express.Router();
const productController = require('../../controllers/products.controller');
const Product = require('../../models/product');

router.get('/product/:series', productController.findSeries);

router.get('/', function (req, res) {
  Product.find().exec(function (err, products) {
    if (err) {
      console.log('Error when fetching products');
      res.render('500', { err: err });
    }
    else {
      res.send(products);
    }
  });
});

router.post('/update', function(req, res) {
  Product.findOneAndUpdate({ model: req.body.model }, {
    'order_information.bag_quantity': req.body.bagQ,
    'order_information.bag_size': req.body.bagS,
    'order_information.material': req.body.mat,
    'order_information.max_pressure_psi': req.body.maxP,
    'order_information.connection': req.body.connection,
    'order_information.connection_type': req.body.cType,
    'pricing.retail': req.body.price,
    qty: req.body.qty
  }).exec(function(err, result) {
    if (err) {
      console.log('Error Updating Product', err);
      req.flash('danger', 'Error Updating Product');
      res.redirect('back');
    } else {
      Product.updateMany({ series: req.body.series }, {
        title: req.body.title,
        description:  req.body.description
      }).exec(function(err, result) {
        if (err) {
          console.log('Error Updating Product', err);
          req.flash('danger', 'Error Updating Product');
          res.redirect('back');
        } else {
          console.log(result);
          req.flash('success', 'Product Updated Successfully');
          res.redirect('back');  
        }
      });
    }
  });
});

module.exports = router;