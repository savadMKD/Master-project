var express = require("express");
const authcontroller = require("../controller/authcontroller");
const productController = require("../controller/productController");
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
router.get("/", verifyLogin, function(req, res, next) {
  let admin = req.session.admin;
  res.render("user/index", { admin_page: true, admin });
});
// Rendering Admin_Login Page
router.get("/login", (req, res) => {
  if (req.session.adminLoggedIn) {
    res.redirect("/");
  } else {
    res.render("admin/auth/login", {
      adminloginErr: req.session.adminloginErr,
      admin_page: true,
    });
    req.session.adminloginErr = false;
  }
});
// Login data connecting to the server
router.post("/login", (req, res) => {
  authcontroller.adminLogin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response.admin;
      req.session.adminLoggedIn = true;
      res.redirect("/admin");
    } else {
      req.session.adminloginErr = "Invlaid username or password";
      res.redirect("/admin/login");
    }
  });
});
// ==================== Logout Functianality ==============
router.get("/logout", (req, res) => {
  req.session.admin = null;
  req.session.adminLoggedIn = false;
  res.redirect("/admin/login");
});
// ============= Rendering Create admin Page ==========
router.get("/createAdmin", verifyLogin, (req, res) => {
  res.render("admin/auth/createAdmin", { admin: true });
});
// ============== Creating Admin Page on the server ==================
router.post("/createAdmin", (req, res) => {
  authcontroller.admin_sigup(req.body).then((response) => {
    req.session.admin = response;
    req.session.adminLoggedIn = true;
    res.redirect("/admin");
  });
});
// ============= Rendering Products Page =====================
router.get("/products", (req, res) => {
  res.render("admin/products/products", { admin: true });
});
// ============ Rendering add products page ========================
router.get("/add-product", (req, res) => {
  res.render("admin/products/add-product", { admin: true });
});
router.post("/add-product", (req, res) => {
  productController.addProduct(req.body).then((id) => {
    let Image = req.files.Image;
    Image.mv("./public/product_images/" + id + ".png", (err) => {
      if (!err) {
        res.render("admin/products/add-product", { admin: true });
      } else {
        console.log(err);
      }
    });
  });
});

module.exports = router;
