//almacenar palabras claves
//numero de puerto

const dbName = process.env.DB_NAME,
  dbHost = process.env.DB_HOST,
  dbPw = process.env.DB_PW,
  dbUser = process.env.DB_USER

module.exports = {
  database: {
    host: dbHost || "localhost",
    user: dbUser || "root",
    password: dbPw || "",
    database: dbName || "xcio75te7dp3awav",
    port: 3306
  }
};
