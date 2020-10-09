//rutas relacionadas con el loggeo
const express = require("express");
const router = express.Router();
const helpers = require("../lib/helpers");

const passport = require("passport");
const { isLoggedIn } = require("../lib/auth");

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
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/perfil",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);

});

router.get("/perfil", isLoggedIn, (req, res) => {
  res.render("auth/perfil");
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

module.exports = router;
