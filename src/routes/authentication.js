//rutas relacionadas con el loggeo
const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
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

router.get("/perfil", (req, res) => {
  res.render("auth/perfil");
});

module.exports = router;
