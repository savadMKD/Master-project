var express = require('express');
const authcontroller = require('../controller/authcontroller');
var router = express.Router();

// ============= Checking admin is logged in or not ==================
const verifyLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  let admin = req.session.admin;
  res.render('user/index', { admin_page: true, admin });
});
// Rendering Admin_Login Page
router.get("/login", (req, res) => {
  if (req.session.adminLoggedIn) {
    res.redirect("/");
  } else {
    res.render("admin/auth/login", { "adminloginErr": req.session.adminloginErr, admin_page:true });
    req.session.adminloginErr = false;
  }
});
// Login data connecting to the server
router.post('/login', (req, res) => {
  authcontroller.adminLogin(req.body).then((response) => {
    if(response.status){
      req.session.admin = response.admin;
      req.session.adminLoggedIn = true;
      res.redirect("/admin");
    }
    else{
      req.session.adminloginErr = "Invlaid username or password";
      res.redirect("/admin/login");
    }
  });
});
router.get('/logout', (req, res) => {
  req.session.admin = null;
  req.session.adminLoggedIn = false;
  res.redirect("/admin/login");
});

module.exports = router;