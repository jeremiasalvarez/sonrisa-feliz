//rutas relacionadas con el loggeo
const express = require("express");
const router = express.Router();

const pool = require("../datebase");

router.get("/login", (req, res) => {
  res.render("turnos/login");
});

//manejo logueo
router.post("/login", (req, res) => {
  res.send("Logueado!");
});

module.exports = router;
