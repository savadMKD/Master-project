var express = require('express');
var router = express.Router();

//  Render Home Page
router.get('/', function(req, res, next) {
  res.render('user/index');
});
// Render products page
router.get('/products', (req, res) => {
  res.render('user/products/products');
});
// Render Login and Signup Pages
router.get('/signup', (req, res) => {
  res.render('user/auth/signup');
});
router.get('/login', (req, res) => {
  res.render('user/auth/login');
});
// Sending And Recieving Data of Login and Signup Page From Server
router.post('/signup', (req, res) => {
  console.log(req.body);
});
router.post('/login', (req, res) => {
  console.log(req.body)
});

module.exports = router;