const bcrypt = require("bcryptjs");
const helpers = {};

helpers.encryptPassword = async (password) => {
  //Generamos un patron
  const salt = await bcrypt.genSalt(10);
  //Usando el patron codificamos la contraseña
  const finalPassword = await bcrypt.hash(password, salt);
  //devolvemos la contraseña cifrada
  return finalPassword;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e);
  }
};

module.exports = helpers;
