let express = require('express');
let router = express.Router();
let controller = require('../controllers/products.controller');

/* GET product listing. */
router.get('/', controller.listProducts);

router.get('/:series', controller.findSeries);

router.get('/:series/subscriptions', controller.subscriptions);

module.exports = router;