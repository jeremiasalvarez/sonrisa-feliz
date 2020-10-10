//rutas relacionadas con el loggeo
const express = require("express");
const router = express.Router();
const pool = require("../datebase");
const { isLoggedIn } = require("../lib/auth");
const { getUserData, getHorarios, getDias }  = require("../lib/helpers");


router.get("/pedirTurno", isLoggedIn, async (req, res) => {

  const userData = await getUserData(req.user.id);

  const dias = await getDias();

  const horarios = await getHorarios();


  const data = {
    userData: userData[0],
    dias: dias,
    horarios: horarios
  }

  res.render("turnos/solicitarTurno", data);
});

module.exports = router;
