const express = require("express");
const morgan = require("morgan");

//Inicializaciones
const app = express();

//Configuraciones
app.set("port", process.env.PORT || 4000);

//Middlewares
//cada que un cliente envia una peticion
//por ejemplo morgan
app.use(morgan("dev")); //para mostrar mensajes en consola

//Variables Globales

//Routes

//Archivos Publicos (codigo que el navegador puede acceder)

//Inicialización del servidor
app.listen(app.get("port"), () => {
  console.log("Server en puerto ", app.get("port"));
});
