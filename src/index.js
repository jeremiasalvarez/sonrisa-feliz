const express = require("express");
const morgan = require("morgan");
const expresshbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");

//Inicializaciones
const app = express();
require("./lib/passport");
//Configuraciones
app.set("port", process.env.PORT || 4000);
//ruta de la carpeta views
app.set("views", path.join(__dirname, "views"));

app.engine(
  ".hbs",
  expresshbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars")
  })
);

app.set("view engine", ".hbs");
//Middlewares
//cada vez que un cliente envia una peticion
//por ejemplo morgan
app.use(morgan("dev")); //para mostrar mensajes en consola con las solicitudes y que valor retorna
app.use(express.urlencoded({ extended: false })); //aceptar desde el formulario los datos del usuario
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales
app.use((req, res, next) => {
  //toma el pedido del usuario con req
  //toma lo que quiere responder el servidor
  //next continua con el resto del código
  next();
});

//Routes
app.use(require("./routes/index.js"));
app.use(require("./routes/authentication.js"));
app.use(require("./routes/login"));

//Archivos Publicos (codigo que el navegador puede acceder)
app.use(express.static(path.join(__dirname, "public")));

//Inicialización del servidor
app.listen(app.get("port"), () => {
  console.log("Server en puerto ", app.get("port"));
});
