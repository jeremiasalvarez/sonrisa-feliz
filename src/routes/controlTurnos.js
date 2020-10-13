//rutas relacionadas con el loggeo
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../lib/auth");
const { getUserData, getHorarios, getDias, guardarSolicitud }  = require("../lib/helpers");


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


router.post("/pedirTurno", isLoggedIn, async (req, res, next) => {
  
  //console.log(req.body.dia);

  const data = {
    user_id: req.user.id,
    horario_id: req.body.horario,
    dia_id: req.body.dia,
    msg: req.body.msg
  }

  // console.log(data);

  const result = await guardarSolicitud(data);
  
  // console.log(result);

  if (result.success) {

    res.redirect('http://localhost:4000')
  }


})

module.exports = router;
