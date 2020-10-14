//rutas relacionadas con el loggeo
const express = require("express");
const router = express.Router();
const helpers = require("../lib/helpers");

const passport = require("passport");
const { isLoggedIn, validateLogInForm, isAdmin } = require("../lib/auth");

router.get("/signup", async (req, res) => {
  const obras =  await helpers.getObrasSociales();

  let string = JSON.stringify(obras);

  let obrasJson = JSON.parse(string);


  res.render("auth/signup", {obrasJson});
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/perfil",
    failureRedirect: "/signup",
    failureFlash: true
  })
);

router.get("/login", (req, res) => {
  
  //* se renderiza perfil + el mensaje porque si llega hasta aca significa que ya estaba loggeado


  if (req.isAuthenticated()){
    return res.render("auth/perfil", {message: "Ya iniciaste sesion en el sitio"});
  } else {
    
    if (req.query.redirected) {
      return res.render("auth/login", {message: "Debes iniciar sesion para ver esta seccion"});
    }
    return res.render("auth/login");
  }
});

router.post("/login", validateLogInForm, (req, res, next) => {
  
  passport.authenticate("local.signin", {
    successRedirect: "/perfil",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);

});

router.get("/perfil", isLoggedIn, isAdmin, (req, res) => {

  if (req.admin)
    return res.redirect("/admin");

  return res.render("auth/perfil");
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

module.exports = router;
