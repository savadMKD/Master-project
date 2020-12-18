var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index');
});

// Render products page
router.get('/products', (req, res) => {
  res.render('user/products')
})

module.exports = router;
