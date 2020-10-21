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
const mercadopago = require('mercadopago')

//Inicializaciones
const app = express();
require("./lib/passport");

//Archivos Publicos (codigo que el navegador puede acceder)
app.use(express.static(path.join(__dirname, "/public")));

//Configuraciones
app.set("port", process.env.PORT || 4000);

mercadopago.configure({
  access_token: 'APP_USR-8212519828945233-032023-74a9ede2f9da37c1991c1519021a1d8e-173454924'
});

// Crea un objeto de preferencia
let preference = {
  items: [
    {
      title: 'Mi producto',
      unit_price: 100,
      quantity: 1,
    }
  ]
};

mercadopago.preferences.create(preference)
.then(function(response){
// Este valor reemplazará el string "<%= global.id %>" en tu HTML
  global.id = response.body.id;
}).catch(function(error){
  console.log(error);
});
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
  
  // if(req.user && req.user.rol == 'paciente'){
  //   app.locals.paciente = req.user;
  // }else{
  //   if(req.user && req.user.rol == 'admin'){
  //     app.locals.admin = req.user;
  //   }
  // }
  
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
