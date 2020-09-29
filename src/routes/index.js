const express = require("express");
const router = express.Router();

//Ruta inicial de la pagina web
router.get("/", (req, res) => {
  //pagina raiz
  //Si ya se inicio sesion mostrar pagina bienvenida

  //Si no se inicio sesion redireccionar a /login
  res.render("turnos/login");
});

const pool = require("../datebase");

module.exports = router;
