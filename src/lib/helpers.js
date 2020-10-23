const bcrypt = require("bcryptjs");
const helpers = {};
const pool = require("../datebase");
const nodemailer = require("nodemailer");
const moment = require("moment");
//const { transporter } = require("../lib/mailer");

moment.locale("es-mx");

const fechaOcupada = async (data) => {

  try {

    const rows = await pool.query("SELECT fecha FROM turno_paciente WHERE fecha = ? AND id_horario = ?", [data.fecha, data.id_horario]);

    if (rows.length === 0) {
      return {
        ocupado: false
      }
    } else {
      return {
        ocupado: true,
        msg: "La fecha y los horarios seleccionados no estan disponibles porque ya existe un turno programado con la combinacion seleccionada. Intente con una nueva combinacion de fecha y horario"
      }
    }

  } catch (error) {
      return {
        ocupado: true,
        msg: "HUBO UN ERROR: " + error
      }
  }

}

const getHorarioConId = helpers.getHorario;

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

  
  result.forEach(horario => {

    const { hora_inicio, hora_fin } = horario;

    horario.hora_inicio = formatearHorario(hora_inicio);
    horario.hora_fin = formatearHorario(hora_fin);
    
  })

  return toJson(result);
}

helpers.getHorario = async (id) => {

  try {

  const result = await pool.query("SELECT id, hora_inicio, hora_fin FROM turnos_horarios WHERE id = ?", [id]);
  
  result.forEach(horario => {

    const { hora_inicio, hora_fin } = horario;

    horario.hora_inicio = formatearHorario(hora_inicio);
    horario.hora_fin = formatearHorario(hora_fin);

  })

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
      fecha_solicitud: moment().toISOString(true),
      mensaje_solicitud: data.msg,
      img_ruta: data.imgPath
    }

    const { yaExiste, fechaPendiente } = await solicitudYaExiste(nuevaSolicitud.id_usuario);

    if (yaExiste) {

      const { fecha, hora } = formatearFecha(fechaPendiente, "FH");
      return {
        success: false,
        msg: `Ya realizaste una solicitud el ${fecha} a las ${hora}. No puedes realizar mas solicitudes hasta que se procese tu ultima solicitud`
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

function getEdad(nacimiento) {

    try {
        
      let birthday = +new Date(nacimiento);
      return ~~((Date.now() - birthday) / (31557600000));
    } catch (error) {

      return 0;
    }
}

helpers.getPacientes = async () => {

  try {
      
    const pacientes = await pool.query("SELECT usuario.id, usuario.email, usuario.rol, ficha_paciente.dni, ficha_paciente.nombre, ficha_paciente.apellido, ficha_paciente.telefono, ficha_paciente.fecha_nacimiento FROM usuario INNER JOIN ficha_paciente ON usuario.id=ficha_paciente.id_usuario WHERE usuario.rol='paciente'");

    pacientes.forEach(paciente => {

      const { fecha_nacimiento } = paciente;

      paciente.edad = getEdad(fecha_nacimiento);
      
    })

    return toJson(pacientes);
  } catch (error) {

    return {error}
  }
  

}


helpers.getHistoriaClinica = async (id) => {

      const rows = await pool.query("SELECT historia_clinica_paciente.id, historia_clinica_paciente.id_usuario, historia_clinica_paciente.id_turno, historia_clinica_paciente.observaciones, turno_paciente.id_prestacion, turno_paciente.id_horario, turno_paciente.fecha, prestaciones.nombre AS nombre_prestacion, turnos_horarios.hora_inicio, turnos_horarios.hora_fin, ficha_paciente.nombre, ficha_paciente.apellido FROM historia_clinica_paciente INNER JOIN turno_paciente ON historia_clinica_paciente.id_turno=turno_paciente.id INNER JOIN prestaciones ON turno_paciente.id_prestacion=prestaciones.id INNER JOIN turnos_horarios ON turno_paciente.id_horario=turnos_horarios.id INNER JOIN ficha_paciente ON historia_clinica_paciente.id_usuario=ficha_paciente.id_usuario WHERE historia_clinica_paciente.id_usuario=? ", [id]);

      rows.forEach(row => {

        const { fecha, hora_inicio, hora_fin } = row;

        let {fecha: fechaFormateada} = formatearFecha(fecha, "DF");
        let inicioFormateado = formatearHorario(hora_inicio);
        let finFormateado = formatearHorario(hora_fin);

        row.fecha_formateada = fechaFormateada;
        row.hora_inicio = inicioFormateado;
        row.hora_fin = finFormateado;
      });

      return toJson(rows);
}

helpers.guardarHistoriaClinica = async (data) => {

  try {

    const nuevaFicha = {
      id_usuario: data.id_usuario,
      id_turno: data.id_turno,
      observaciones: data.observaciones
    }

    const insert = await pool.query("INSERT INTO historia_clinica_paciente SET ?", nuevaFicha);

    return {
      success: true,
      id: insert.insertId,
      msg: "ficha insertada"
    }

  } catch (error) {
    
    return {
      success: false,
      msg: error
    }
  }

}

helpers.cancelarTurno = async (id) => {

  try {

    const query = await pool.query("DELETE FROM turno_paciente WHERE id = ?", [id]);
    
    const result = {
      success: query.affectedRows == 1,
      msg: query.affectedRows == 1 ? "El turno fue cancelado correctamente" : "El turno no fue cancelado correctamente"
    }

    return result;
    
  } catch (error) {

      return {
        success: false,
        msg: "Algo salio mal"
      }
  }


}  

helpers.reprogramarTurno = async (data) => {

    try {

        const { id_turno, fecha, id_horario } = data;

        const { ocupado, msg } = await fechaOcupada({fecha, id_horario});

        if (ocupado) {

          return {
            success: false,
            msg
          }
        }

        const query = await pool.query("UPDATE turno_paciente SET fecha = ?, id_horario = ? WHERE id = ?", [fecha, id_horario, id_turno]);
        
        if (query.affectedRows === 1){ 

          const { fecha: nueva_fecha, dia: nuevo_dia } = formatearFecha(fecha, "DF");

          return {
            success: true,
            msg: "El turno fue actualizado correctamente",
            nueva_fecha,
            nuevo_dia,
            fecha_calendario: moment(fecha).format('L')
          }
        } else {
          return {success: false, msg: "Algo salio mal. El turno no fue reprogramado correctamente"}
        }


    } catch (error) {
        
        return {
          success: false,
          msg: error.message
        }
    }
} 

helpers.getTurnos = async () => {

  try {

      const rows = await pool.query("SELECT turno_paciente.id AS id_turno, turno_paciente.id_usuario, turno_paciente.id_horario, turno_paciente.id_prestacion, turno_paciente.fecha, turno_paciente.img_ruta, ficha_paciente.dni, ficha_paciente.nombre AS nombre_paciente, ficha_paciente.apellido, ficha_paciente.telefono, usuario.email, prestaciones.nombre AS nombre_prestacion, turnos_horarios.hora_inicio, turnos_horarios.hora_fin FROM turno_paciente INNER JOIN usuario ON turno_paciente.id_usuario=usuario.id  INNER JOIN ficha_paciente ON turno_paciente.id_usuario=ficha_paciente.id_usuario INNER JOIN prestaciones ON turno_paciente.id_prestacion=prestaciones.id INNER JOIN turnos_horarios ON turno_paciente.id_horario=turnos_horarios.id");

      rows.forEach(turno => {

        const { fecha, hora_inicio, hora_fin } = turno;

        const { dia, fecha: fechaNombre } = formatearFecha(fecha, "DF");

        
        turno.fecha = moment(fecha).format('L');
        turno.hora_fin = formatearHorario(hora_fin);
        turno.hora_inicio = formatearHorario(hora_inicio);
        turno.dia = `${dia[0].toLocaleUpperCase()}${dia.slice(1)}`
        turno.fechaNombre = fechaNombre;
      })

      return toJson(rows);

  } catch (error) {

    return {error: error};
  }

}

helpers.getSolicitudes = async () => {

  const solicitudes = await pool.query("SELECT solicitudes_turno.id, solicitudes_turno.id_usuario, solicitudes_turno.id_horario, solicitudes_turno.id_dia, solicitudes_turno.fecha_solicitud, solicitudes_turno.mensaje_solicitud, solicitudes_turno.img_ruta, usuario.email, ficha_paciente.dni, ficha_paciente.nombre, ficha_paciente.apellido, ficha_paciente.telefono, ficha_paciente.fecha_nacimiento, turnos_horarios.hora_inicio, turnos_horarios.hora_fin, turnos_dias.nombre_dia FROM solicitudes_turno INNER JOIN usuario ON solicitudes_turno.id_usuario=usuario.id INNER JOIN ficha_paciente ON solicitudes_turno.id_usuario=ficha_paciente.id_usuario INNER JOIN turnos_horarios ON solicitudes_turno.id_horario=turnos_horarios.id INNER JOIN turnos_dias ON solicitudes_turno.id_dia=turnos_dias.id_dia ORDER BY solicitudes_turno.fecha_solicitud ASC");

  solicitudes.forEach(sol => {
    
    const { fecha_solicitud, hora_inicio, hora_fin } = sol; 

    sol.hora_inicio = formatearHorario(hora_inicio);
    sol.hora_fin = formatearHorario(hora_fin);

    const { fecha, hora } = formatearFecha(fecha_solicitud, "FH");

    sol.fecha_solicitud = `${fecha} a las ${hora}`
  })

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
      fecha: data.fecha,
      img_ruta: data.imgPath
    }

    const restriccion = await fechaOcupada({fecha: nuevoTurno.fecha, id_horario:nuevoTurno.id_horario});

    if (restriccion.ocupado) {
      return {
        success: false,
        ocupado: true,
        msg: restriccion.msg
      }
    }

    const query = await pool.query("INSERT INTO turno_paciente SET ?", [nuevoTurno]);

    result.insert_id = query.insertId;

    result.success = true;
    result.msg = "Turno Insertado";

  } catch(e){

    result.success = false;
    result.error = e

    console.log(e);
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

helpers.formatearFecha = formatearFecha;

function formatearFecha(fechaInicial, formato) {

  //* DF = DIA FECHA 
  //* FH = FECHA Y HORA

  const res = {}

  switch (formato) {

    case 'DF':

      res.dia = moment(fechaInicial).format('dddd');
      res.fecha = moment(fechaInicial).format('LL');
      return res;

      break;

    case 'FH':

      res.fecha = moment(fechaInicial).format('LL');
      res.hora = moment(fechaInicial).format('LT');
      return res;
      break;

  }

}

function formatearHorario(horario) {

  const hora = horario.split(":")[0];
  const minuto = horario.split(":")[1];

  return [hora, minuto].join(":");

}

module.exports = helpers;
