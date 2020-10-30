const express = require("express");
const { isLoggedIn, isAdmin } = require("../lib/auth");
const router = express.Router();
const helpers = require("../lib/helpers");

//Ruta inicial de la pagina web
router.get("/", isLoggedIn, isAdmin, async (req, res) => {
  //pagina raiz
  //Si ya se inicio sesion mostrar pagina bienvenida de admin o paciente
  if (req.admin){ 
    return res.render("inicio/admin");
  }

  const userData = await helpers.getUserData(req.user.id);
  const data = {
    userData: userData[0]    
  }

  
  return res.render("auth/perfil",data);
  //Si no se inicio sesion redireccionar a /login
});

router.get("/ficha", isLoggedIn, async (req, res) => {

  const userData = await helpers.getUserData(req.user.id);
  const fechaFormateada = helpers.formatearFecha(userData[0].fecha_nacimiento,"DF");
  const historia = await helpers.getHistoriaClinica(req.user.id);
  const data = { 
    userData: userData[0],
    fechaFormateada,
    historia, 
    fechaDeHoy: helpers.fechaDeHoy() 
  }  

  return res.render("usuario/ficha",data)
}) 

router.get("/pendientes", async (req, res) => {

    const pendientes = await helpers.getPagosPendientes(req.user.id);

    return res.render("usuario/pendientes", {pendientes});

})


module.exports = router;
