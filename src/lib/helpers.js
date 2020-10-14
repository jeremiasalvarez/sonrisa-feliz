const bcrypt = require("bcryptjs");
const helpers = {};
const pool = require("../datebase");

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
  const result = await pool.query("SELECT nombre, descripcion FROM prestaciones");

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

    const query = await pool.query("INSERT INTO solicitudes_turno SET ?", [nuevaSolicitud]);

    result.insert_id = query.insertId;
    result.success = true;
    result.msg = "Insertado";
    result.redirectAdress = "/perfil"

  } catch(e){

    result.success = false;
    result.error = e
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

  const solicitudes = await pool.query("SELECT solicitudes_turno.id, solicitudes_id_usuario, solicitudes_turno.id_horario, solicitudes_turno.id_dia, solicitudes_turno.fecha_solicitud, solicitudes_turno.mensaje_solicitud, usuario.email FROM solicitudes_turno INNER JOIN usuario ON solicitudes_turno.id_usuario=usuario.id");

  return toJson(solicitudes);

}

helpers.eliminarSolicitud = async (id) => {
  
}


function toJson(data) {

  const string = JSON.stringify(data);

  const json = JSON.parse(string);
 
  return json;
}

module.exports = helpers;
