const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../datebase");
const helpers = require("../lib/helpers");

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      //const {} = req.body; -- Elegir parametros que queremos de la request
      const newUser = {
        email: username,
        password
      };
      newUser.password = await helpers.encryptPassword(password);
      const result = await pool.query("INSERT INTO usuario SET ?", [newUser]);
      newUser.id = result.insertId;
      return done(null, newUser);
    }
  )
);

//guardar usuario en la sesion
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query("SELECT * FROM usuario Where id = ?", [id]);
  done(null, rows[0]);
});
