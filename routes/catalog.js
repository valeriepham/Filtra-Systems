let express = require('express');
let router = express.Router();
let controller = require('../controllers/catalog.controller');

/* GET product catalog page. */
router.get('/', controller.allSeries);

module.exports = router;