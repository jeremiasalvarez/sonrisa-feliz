const express = require("express");
const { isLoggedIn, isAdmin } = require("../lib/auth");
const helpers = require("../lib/helpers");
const { getPacientes, getSolicitudes, getHorarios, getPrestaciones, eliminarSolicitud, enviarMail, guardarTurno, getHorario } = require("../lib/helpers");

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

        console.log(solicitudes);

        const data = {
            solicitudes: solicitudes,
            horarios: horarios,
            prestaciones: prestaciones
        }
        
        //  console.log(data);
        
        res.render("admin/solicitudes", data);
    } else {

        res.redirect("/perfil");
    }

})

router.post("/solicitudes/aceptar", isLoggedIn, async (req, res) => {
    
    if (!req.body.fecha){
        return res.json({success: false, message: "No selecciono una fecha"});
    }

    const { id, usuario_id, horario_id, fecha, prestacion_id, nombre, email } = req.body;

    const data = {
        usuario_id,
        horario_id,
        fecha,
        prestacion_id
    }


    const result = await guardarTurno(req.body);

    if (result.success) {

        await eliminarSolicitud(id);

        const { hora_inicio , hora_fin } = await getHorario(horario_id);

        await enviarMail({
            receptor: email,
            asunto: "Sonrisa Feliz - Turno Confirmado",
            cuerpo: `Hola ${nombre}, tu turno fue confirmado<br> 
            Fecha: ${fecha} <br> 
            Horario: De ${hora_inicio} a ${hora_fin}
            <br>
            <i>Sonrisa Feliz</i>` 
        });

    }

    return res.json(result);
})

router.post("/solicitudes/rechazar", isLoggedIn, async (req, res) => {

    const { id, motivo, email, nombre } = req.body;


    if (!id) {
        return res.json({success: false, message: "No ID"});
    }
    
    const result = await eliminarSolicitud(id);

    if (result.success) {
        await enviarMail({
            receptor: email,
            asunto: "Sonrisa Feliz - Solcitud Rechazada",
            cuerpo: `Hola ${nombre}, lamentamos informarte que tu ultima solicitud de turno para el consultorio "Sonrisa Feliz" fue rechazada <br> 
            Motivo: ${motivo} <br> <br>
            <i>Sonrisa Feliz</i>` 
        });
    }

    return res.json(result);

})

router.get("/turnos", isLoggedIn, isAdmin, (req, res) => {
    res.render("admin/turnos");
})

module.exports = router;