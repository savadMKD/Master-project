var express = require('express');
const authController = require('../controller/authcontroller');
var router = express.Router();

// ============= Checking user is logged in or not ==================
const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

//  Render Home Page
router.get('/', function(req, res, next) {
  let user = req.session.user;
  res.render('user/index', { user });
});
// Render products page
router.get('/products', (req, res) => {
  let user = req.session.user;
  res.render('user/products/products', { user });
});
// Render Login and Signup Pages
router.get('/signup', (req, res) => {
  res.render('user/auth/signup');
});
router.get('/login', (req, res) => {
  if (req.session.userLoggedIn) {
    res.redirect("/");
  } else {
    res.render("user/auth/login", { "userloginErr": req.session.userloginErr });
    req.session.userloginErr = false;
  }
});
// Sending And Recieving Data of Login and Signup Page From Server
router.post('/signup', (req, res) => {
  authController.signup(req.body).then((response) => {
    req.session.user = response;
    req.session.userLoggedIn = true;
    res.redirect("/");
  });
});
router.post('/login', (req, res) => {
  authController.userLogin(req.body).then((response) => {
    if(response.status){
      req.session.user = response.user;
      req.session.userLoggedIn = true;
      res.redirect("/");
    }
    else{
      req.session.userloginErr = "Invlaid username or password";
      res.redirect("/login");
    }
  });
});
// =================== User logout ===============
router.get('/logout', (req, res) => {
  req.session.user = null;
  req.session.userLoggedIn = false;
  res.redirect("/");
});

module.exports = router;