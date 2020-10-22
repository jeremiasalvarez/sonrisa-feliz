const express = require("express");
const { isLoggedIn, isAdmin } = require("../lib/auth");
const router = express.Router();

//Ruta inicial de la pagina web
router.get("/", isLoggedIn, isAdmin, (req, res) => {
  //pagina raiz
  //Si ya se inicio sesion mostrar pagina bienvenida de admin o paciente
  if (req.admin){ 
    return res.render("inicio/admin");
  }
  
  return res.render("auth/perfil");
  //Si no se inicio sesion redireccionar a /login
});


router.get("/ficha", isLoggedIn, (req,res) =>{
  return res.render("usuario/ficha")
})

module.exports = router;
