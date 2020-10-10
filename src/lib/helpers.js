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


function toJson(data) {

  const string = JSON.stringify(data);

  const json = JSON.parse(string);
 
  return json;
}

module.exports = helpers;
