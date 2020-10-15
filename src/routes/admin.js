const express = require("express");
const { isLoggedIn, isAdmin } = require("../lib/auth");
const helpers = require("../lib/helpers");
const { getPacientes, getSolicitudes, getHorarios, getPrestaciones, eliminarSolicitud } = require("../lib/helpers");

const router = express.Router();


router.get("/admin", isLoggedIn, isAdmin, (req, res) => {
    if (req.admin) {
      return res.render("inicio/admin");  
    }
    else {
      return res.redirect("/perfil");
    }
})


router.get("/pacientes", isLoggedIn, isAdmin, async (req,res) => {
    if (req.admin){

        const pacientes = await getPacientes();
        
        console.log(pacientes);

        return res.render("admin/pacientes");
    }
    else {
        return res.render("auth/perfil", {message: req.notAllowedMessage});
    }
})

router.get("/solicitudes", isLoggedIn, isAdmin, async (req, res) => {

    if (req.admin) {

        const solicitudes = await getSolicitudes();

        const horarios = await getHorarios();

        const prestaciones = await getPrestaciones();

        console.log(horarios);
        console.log("..........")
        console.log(prestaciones)

        const data = {
            solicitudes: solicitudes,
            horarios: horarios,
            prestaciones: prestaciones
        }
        
        //  console.log(data);
        
        res.render("admin/solicitudes", data);
    }

})

router.post("/solicitudes/rechazar", isLoggedIn, async (req, res) => {

    // console.log(req.query.id);
   
    const id = req.query.id;

    if (!id) {
        return res.json({success: false, message: "No ID"});
    }
    
    const result = await eliminarSolicitud(id);

    return res.json(result);

})

module.exports = router;