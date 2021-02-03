//rutas relacionadas con el loggeo
const express = require("express");
// const path = require("path");
const moment = require("moment");
const aws = require('aws-sdk');
const router = express.Router();
const { isLoggedIn } = require("../lib/auth");
const { getUserData, getHorarios, getDias, guardarSolicitud, fechaHorarioValidos }  = require("../lib/helpers");

const S3_BUCKET = process.env.S3_BUCKET_NAME;
aws.config.region = 'sa-east-1';

function getExt(fileName) {

  let indexPunto = fileName.lastIndexOf(".");
  const ext = fileName.slice(indexPunto);
  return ext;
}

function deleteSpecialChars(fileName) {

  let arr = fileName.split(":");
  arr = arr.join("");
  arr = arr.split("+");
  arr = arr.join("");

  return arr;
}

router.get('/sign-s3', (req, res) => {

  const s3 = new aws.S3();
  const queryName = req.query.file_name;
  const fileType = req.query.file_type;
  const fileExt = getExt(queryName);
  const tempExt = fileExt.toLowerCase();

  if (tempExt != '.jpeg' && tempExt != '.jpg' && tempExt != '.png') {
    return res.status(400).json({wrongType:true, success: false, msg: "No es un tipo de archivo valido. La imagen debe tener un formato '.png' o '.jpeg' o '.jpg'"})
  }

  let fileName = `solicitud_turno_${req.user.id}_${moment().format()}${fileExt}`;

  fileName = deleteSpecialChars(fileName);

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 260,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.json({success: false, msg: err});
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });

});

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
  
  const data = {
    user_id: req.user.id,
    horario_id: req.body.horario_id,
    fecha_solicitada: req.body.fecha_solicitada,
    msg: req.body.msg,
    imgPath: req.body.imgPath
  }

  const fechaHorarioValido = await fechaHorarioValidos(req.body.horario_id, req.body.fecha_solicitada);

  if (!fechaHorarioValido) {
      return res.json({success: false, msg: "La fecha y el horario seleccionado no son validos. Debe seleccionar una fecha posterior a la actual"})
  }   

  const result = await guardarSolicitud(data);
  console.log(result)
  if (result.success) {

    res.status(200).json(result);

  } else {
    
    res.status(400).json(result);
  
  }


})


module.exports = router;
