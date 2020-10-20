//rutas relacionadas con el loggeo
const express = require("express");
const path = require("path");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../lib/auth");
const { getUserData, getHorarios, getDias, guardarSolicitud }  = require("../lib/helpers");


const multer = require("multer");

const storageSolicitudes = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/assets/img/solicitudes/')
  },
  filename: function (req, file, cb) {
    /*Appending extension with original name*/
    cb(null, "solicitud_"+ req.user.email + path.extname(file.originalname).toLocaleLowerCase()) 
  }
})

const uploadSolicitudes = multer({ 
                                  storage: storageSolicitudes,
                                  fileFilter: function (req, file, cb) {
                                    
                                    
                                    let ext = path.extname(file.originalname).toLowerCase();

                                    if(ext == '.png' || ext == '.jpg' || ext == '.jpeg') {  
                                      req.mensaje = "La imagen es valida";
                                      req.newImgPathExt = path.extname(file.originalname) 
                                      cb(null, true);

                                    }  else {
                                      req.fileValidationError = true;
                                      req.mensaje = "La imagen es invalida o no existe"
                                      cb(null, false);
                                    }
                                          
                                  }})


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

router.post("/upload-img", uploadSolicitudes.single('imagen'), (req, res) => {

  // console.log(req.mensaje);

  if (!req.file) {
      console.log("no imagen");
      return res.json({success: false, msg: "Debe proprorcionar una imagen"})
  } else {
    console.log("hay imagen");
  }

  if (req.fileValidationError) {
    return res.json({msg : "La imagen proporcionada no es un formato valido. Formatos aceptados: '.jpg', '.jpeg', '.png'", success: false})
  } 
  return res.json({success: true, msg: "imagen insertada", path: `solicitud_${req.user.email}${req.newImgPathExt.toUpperCase()}`});

})


router.post("/pedirTurno", isLoggedIn, async (req, res, next) => {
  
  const data = {
    user_id: req.user.id,
    horario_id: req.body.horario_id,
    dia_id: req.body.dia_id,
    msg: req.body.msg,
    imgPath: req.body.imgPath
  }

  const result = await guardarSolicitud(data);
  

  // // console.log(result);

  if (result.success) {

    

    res.status(200).json(result);

  } else {
    
    res.status(400).json(result);
  
  }


})


module.exports = router;
