const express = require("express");
const { isLoggedIn } = require("../lib/auth");
const router = express.Router();

//Ruta inicial de la pagina web
router.get("/", isLoggedIn, (req, res) => {
  //pagina raiz
  //Si ya se inicio sesion mostrar pagina bienvenida
  //Si no se inicio sesion redireccionar a /login
  console.log(req.logged);
  res.render("auth/perfil");
});

module.exports = router;
