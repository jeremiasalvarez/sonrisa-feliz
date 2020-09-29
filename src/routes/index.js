const express = require("express");
const router = express.Router();

//Ruta inicial de la pagina web
router.get("/", (req, res) => {
  //pagina raiz del logeo
  //mostrar login
  res.render("turnos/login");
});

const pool = require("../datebase");

module.exports = router;
