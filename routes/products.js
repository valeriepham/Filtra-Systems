let express = require('express');
let router = express.Router();
let controller = require('../controllers/products.controller');

/* GET product listing. */
router.get('/', controller.allSeries);

router.get('/:series', controller.findSeries);

module.exports = router;