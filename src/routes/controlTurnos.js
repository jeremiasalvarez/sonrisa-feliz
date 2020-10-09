//rutas relacionadas con el loggeo
const express = require("express");
const router = express.Router();
const pool = require("../datebase");
const { isLoggedIn } = require("../lib/auth");
const { getPrestaciones }  = require("../lib/helpers");


router.get("/pedirTurno", isLoggedIn, async (req, res) => {

  // const prestaciones = await getPrestaciones();

  // console.log(prestaciones);

  res.render("turnos/solicitarTurno");
});

module.exports = router;
