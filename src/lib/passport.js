const { use } = require("passport");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../datebase");
const helpers = require("../lib/helpers");

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      const rows = await pool.query("SELECT * FROM usuario WHERE email = ? ", [
        username
      ]);
      if (rows.length > 0) {
        const user = rows[0];
        //validar contraseña
        const validPassword = await helpers.matchPassword(
          password,
          user.password
        );
        if (validPassword) {
          done(null, user, req.flash("success", "Bienvenido " + user.email));
        } else {
          done(null, false, req.flash("message", "Contraseña incorrecta"));
        }
      } else {
        //no se encontraron emails registrados
        return done(null, false, req.flash("message", "Email no registrado!"));
      }
    }
  )
);

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, username, password, done) => {

      const newUser = {
        email: username,
        password
      };
      newUser.password = await helpers.encryptPassword(password);
      const result = await pool.query("INSERT INTO usuario SET ?", [newUser]);
      newUser.id = result.insertId;

      const dni = await nuevaFichaMedica(result.insertId, req.body);

      return done(null, newUser);
    }
  )
);

async function nuevaFichaMedica(id, datos) {

  const { nombre, apellido, dni, obra, telefono, nacimiento } = datos;

  const nuevaFicha = {
      id_usuario: id,
      nombre,
      apellido,
      dni,
      telefono,
      fecha_nacimiento: nacimiento
  }

  const result = await pool.query("INSERT INTO ficha_paciente SET ?", [nuevaFicha]);

  const resultObraSocialPaciente = await nuevaObraSocialPaciente(obra, dni);

  return result;

}

async function nuevaObraSocialPaciente(obra, dniPaciente) {

  const queryObra = await pool.query("SELECT cod_obra_social FROM obra_social WHERE nombre = ?", [obra]);

  

  const idObra = queryObra[0];

  const string = JSON.stringify(idObra);

  const idJson = JSON.parse(string);


  console.log(idJson.cod_obra_social);

  const nuevaObra =  {
      dni_paciente: dniPaciente,
      cod_obra_social: idJson.cod_obra_social
  }

  const result = await pool.query("INSERT INTO obra_social_paciente SET ?", [nuevaObra]);

}

//guardar usuario en la sesion
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query("SELECT * FROM usuario Where id = ?", [id]);
  done(null, rows[0]);
});
