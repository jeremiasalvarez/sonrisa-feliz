const express = require("express");
const router = express.Router();

//Ruta inicial de la pagina web
router.get("/", (req, res) => {
  res.send("Hola mundo");
});
module.exports = router;
