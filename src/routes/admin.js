const express = require("express");
const { isLoggedIn, isAdmin } = require("../lib/auth");
const { getPacientes, getSolicitudes } = require("../lib/helpers");

const router = express.Router();


router.get("/admin", isLoggedIn, isAdmin, (req, res) => {
    if (req.admin) {
      return res.render("inicio/admin");  
    }
    else {
      return res.redirect("/perfil");
    }
})


router.get("/admin/pacientes", isLoggedIn, isAdmin, async (req,res) => {
    if (req.admin){

        const pacientes = await getPacientes();
        
        console.log(pacientes);

        return res.render("admin/pacientes");
    }
    else {
        return res.render("auth/perfil", {message: req.notAllowedMessage});
    }
})

router.get("/admin/solicitudes", isLoggedIn, isAdmin, async (req, res) => {

    if (req.admin) {

        const solicitudes = await getSolicitudes();
        
        console.log(solicitudes);
        
    }

})

module.exports = router;