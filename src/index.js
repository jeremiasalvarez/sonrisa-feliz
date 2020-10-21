const express = require("express");
const morgan = require("morgan");
const expresshbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const mysqlStore = require("express-mysql-session");
const flash = require("connect-flash");
require('dotenv').config();
const { database } = require("./keys");
const aws = require('aws-sdk')

//Inicializaciones
const app = express();
require("./lib/passport");


//Archivos Publicos (codigo que el navegador puede acceder)
app.use(express.static(path.join(__dirname, "/public")));

//Configuraciones
app.set("port", process.env.PORT || 4000);
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = '	sa-east-1';
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
app.use(
  session({
    secret: "DentistaSession",
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database)
  })
);
app.use(flash());
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
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.user = req.user;
  if(req.user){
    if(req.user.rol=='admin'){
      app.locals.admin = req.user;
    }else{
      app.locals.paciente = req.user
    }
  }
  
  next();
});

//Routes
app.use(require("./routes/index.js"));
app.use(require("./routes/authentication.js"));
app.use(require("./routes/controlTurnos"));
app.use(require("./routes/admin"));

//Inicialización del servidor
app.listen(app.get("port"), () => {
  console.log("Server en puerto ", app.get("port"));
});
