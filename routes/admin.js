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
  res.render("admin/index", { admin_page: true, admin });
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
  let admin = req.session.admin;
  res.render("admin/auth/createAdmin", { admin_page: true, admin });
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
router.get("/products", verifyLogin, (req, res) => {
  productController.getAllProducts().then((Products) => {
    let admin = req.session.admin;
    res.render("admin/products/products", { admin_page: true, Products, admin });
  });
});
// ============ Rendering add products page ========================
router.get("/add-product", verifyLogin, (req, res) => {
  let admin = req.session.admin;
  res.render("admin/products/add-product", { admin_page: true, admin });
});
router.post("/add-product", (req, res) => {
  productController.addProduct(req.body).then((id) => {
    let Image = req.files.Image;
    // ======= Recieving image and stored in product_images folder ==
    Image.mv("./public/product_images/" + id + ".png", (err) => {
      if (!err) {
        res.render("admin/products/add-product", { admin: true });
      } else {
        console.log(err);
      }
    });
  });
});
// =============== deleting Product ===========
router.get('/delete_product/:id', (req, res) => {
  let product_id = req.params.id;
  productController.deleteProduct(product_id).then((response) => {
    res.redirect('/admin/products');
  });
});
// ======= Rendering Edit Product Page and sending Values ========
router.get('/edit_product/:id', verifyLogin, async (req, res) => {
  let Product = await productController.getProductDetails(req.params.id);
  res.render('admin/products/edit-product', { admin_page: true, Product });
});
// ============ Updating Product Values and sending to the server ===============
router.post('/edit_product/:id', (req, res) => {
  let product_id = req.params.id;
  productController.updateProduct(product_id, req.body).then(() => {
    res.redirect('/admin/products');
    if(req.files.Image){
      let Image = req.files.Image;
      Image.mv("./public/product_images/" + product_id + ".png");
    };
  });
});

module.exports = router;