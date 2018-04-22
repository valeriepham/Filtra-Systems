'use strict';

const express = require('express');
const router = express.Router();

const cartRoutes = require('./cart');
const orderRoutes = require('./orders');
const productRoutes = require('./products');
const userRoutes = require('./users');

router.get('/', function(req, res) {
  res.status(200).send('Welcome to the Filta Systems API!');
});

router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/user', userRoutes);

module.exports = router;