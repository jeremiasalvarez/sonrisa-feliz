//rutas relacionadas con el loggeo
const express = require("express");
const router = express.Router();
const pool = require("../datebase");
const { isLoggedIn } = require("../lib/auth");

router.get("/pedirTurno", isLoggedIn, (req, res) => {
  res.render("turnos/solicitarTurno");
});

module.exports = router;
