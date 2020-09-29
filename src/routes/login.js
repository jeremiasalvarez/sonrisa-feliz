//rutas relacionadas con el loggeo
const express = require("express");
const router = express.Router();
const pool = require("../datebase");

router.get("/login", (req, res) => {
  res.render("turnos/login");
});

//manejo logueo
router.post("/login", async (req, res) => {
  //obtenemos los datos del usuario a partir del request
  const { email, password } = req.body;
  //creamos un objeto nuevo---
  //controlar que los campos de la tabla coincidan
  const newLogin = {
    email,
    password
  };

  //Buscamos en la base de datos si el usuario existe
  await pool.query("INSERT INTO usuario set ? ", [newLogin]);

  res.send("Logueado!");

  //Si existe, ir a la pagina de ficha medica

  //Si no existe, mostrar mensaje error
});

module.exports = router;
