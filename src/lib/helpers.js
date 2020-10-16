const bcrypt = require("bcryptjs");
const helpers = {};
const pool = require("../datebase");
const nodemailer = require("nodemailer");
//const { transporter } = require("../lib/mailer");

helpers.encryptPassword = async (password) => {
  //Generamos un patron
  const salt = await bcrypt.genSalt(10);
  //Usando el patron codificamos la contraseña
  const finalPassword = await bcrypt.hash(password, salt);
  //devolvemos la contraseña cifrada
  return finalPassword;
};

//contraseña en texto plano y la contraseña guardada en la bd
helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e);
  }
};

helpers.getObrasSociales = async () => {
  const result = await pool.query("SELECT cod_obra_social , nombre FROM obra_social");
  

  return result;
}

helpers.getPrestaciones = async () => {
  const result = await pool.query("SELECT id, nombre, descripcion FROM prestaciones");

  const json = toJson(result);

  return json;
}

helpers.getUserData = async (id) => {

  try {
    const data = await pool.query("SELECT usuario.id, usuario.email, ficha_paciente.nombre, ficha_paciente.apellido, ficha_paciente.telefono FROM usuario INNER JOIN ficha_paciente ON usuario.id=ficha_paciente.id_usuario WHERE usuario.id=?",[id]);

    return toJson(data);
    
  } catch(e) {
    console.error(e)
  }
}

helpers.getDias = async () => {

  const result = await pool.query("SELECT id_dia, nombre_dia FROM turnos_dias");

  return toJson(result);
}

helpers.getHorarios = async () => {

  const result = await pool.query("SELECT id, hora_inicio, hora_fin FROM turnos_horarios ORDER BY hora_inicio ASC");

  return toJson(result);
}

helpers.getHorario = async (id) => {

  try {

  const result = await pool.query("SELECT id, hora_inicio, hora_fin FROM turnos_horarios WHERE id = ?", [id]);

  
  return toJson(result[0]);

  } catch (e){
    return toJson({error: e});
  }

}

const solicitudYaExiste = async (idUsuario) => {

  const result = {}

  try {

    const rows = await pool.query("SELECT fecha_solicitud FROM solicitudes_turno WHERE id_usuario = ? ORDER BY fecha_solicitud ASC", [idUsuario]);

    if (rows.length > 0) {
      result.yaExiste = true;
      result.fechaPendiente = toJson(rows[0]).fecha_solicitud;
      console.log(result.fechaPendiente);
    } else {
      result.yaExiste = false;
    }

    return result;

  } catch (error) {

    return { yaExiste: true , success: false, error: true, message: error}

  }

}

helpers.guardarSolicitud = async (data) => {

  const result = {}

  try {

    const nuevaSolicitud = {
      id_usuario: data.user_id,
      id_horario: data.horario_id,
      id_dia: data.dia_id,
      fecha_solicitud: new Date().toISOString(),
      mensaje_solicitud: data.msg
    }

    const { yaExiste, fechaPendiente } = await solicitudYaExiste(nuevaSolicitud.id_usuario);

    if (yaExiste) {
      return {
        success: false,
        msg: `Ya realizaste una solicitud el ${fechaPendiente}. No puedes realizar mas solicitudes hasta que se procese tu ultima solicitud`
      }
    }

    const query = await pool.query("INSERT INTO solicitudes_turno SET ?", [nuevaSolicitud]);

    result.insert_id = query.insertId;
    result.success = true;
    result.msg = "Insertado";
    result.redirectAdress = "/perfil"

  } catch(e){

    result.success = false;
    result.msg = e
  };

  return result;
}

helpers.getRol = async (userId) => {
  const result = {};
  const rows = await pool.query("SELECT rol FROM usuario WHERE id = ?", [userId]);

  if (rows.length > 0) {
    
    const user = toJson(rows[0]);

    result.isAdmin = user.rol === 'admin';

  } else {
    result.isAdmin = false;
  }

  return result;
  
}

helpers.getPacientes = async () => {
  
  const pacientes = await pool.query("SELECT usuario.id, usuario.email, ficha_paciente.dni, ficha_paciente.nombre, ficha_paciente.apellido, ficha_paciente.telefono FROM usuario INNER JOIN ficha_paciente ON usuario.id=ficha_paciente.id_usuario");

  return toJson(pacientes);

}

helpers.getPaciente = async (id) => {
  
}

helpers.getSolicitudes = async () => {

  const solicitudes = await pool.query("SELECT solicitudes_turno.id, solicitudes_turno.id_usuario, solicitudes_turno.id_horario, solicitudes_turno.id_dia, solicitudes_turno.fecha_solicitud, solicitudes_turno.mensaje_solicitud, usuario.email, ficha_paciente.dni, ficha_paciente.nombre, ficha_paciente.apellido, ficha_paciente.telefono, ficha_paciente.fecha_nacimiento, turnos_horarios.hora_inicio, turnos_horarios.hora_fin, turnos_dias.nombre_dia FROM solicitudes_turno INNER JOIN usuario ON solicitudes_turno.id_usuario=usuario.id INNER JOIN ficha_paciente ON solicitudes_turno.id_usuario=ficha_paciente.id_usuario INNER JOIN turnos_horarios ON solicitudes_turno.id_horario=turnos_horarios.id INNER JOIN turnos_dias ON solicitudes_turno.id_dia=turnos_dias.id_dia ORDER BY solicitudes_turno.fecha_solicitud ASC");

  return toJson(solicitudes);

}

helpers.eliminarSolicitud = async (id) => {

  const result = {}

   try {

      const query = await pool.query("DELETE FROM solicitudes_turno WHERE id = ?", [id]);

      result.affectedRows = query.affectedRows;
      result.success = true;
      
      return result;

   } catch(e) {

      result.success = false;
      result.error = e;
   }
}

helpers.guardarTurno = async (data) => {

  const result = {}

  try {

    const nuevoTurno = {
      id_usuario: data.usuario_id,
      id_horario: data.horario_id,
      id_prestacion: data.prestacion_id,
      fecha: data.fecha
    }

    const query = await pool.query("INSERT INTO turno_paciente SET ?", [nuevoTurno]);

    result.insert_id = query.insertId;
    result.success = true;
    result.msg = "Turno Insertado";

  } catch(e){

    result.success = false;
    result.error = e
  };

  return result;
}

helpers.enviarMail = async (data) => {
 try {
    let transporter = nodemailer.createTransport({
      host: "smtp.elasticemail.com",
      port: 2525,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: "lospiratasutn@gmail.com",
        pass: "656DC89B6C2547A989C6E8377DA12E200DC2"
      }
    });


    let info = await transporter.sendMail({
      from: '"Sonrisa Feliz - Doctora Sonrisa" <lospiratasutn@gmail.com>', // sender address
      to: data.receptor, // list of receivers
      subject: data.asunto, // Subject line
      // text: "Hello world?", // plain text body
      html: data.cuerpo, // html body
      
    });
    
    console.log("Message sent: %s", info.messageId);

} catch(e) {
  console.log(e);
  return;
}


}


function toJson(data) {

  const string = JSON.stringify(data);

  const json = JSON.parse(string);
 
  return json;
}

module.exports = helpers;
