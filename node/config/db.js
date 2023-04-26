const mysql = require("mysql");
const config = require("./config");

const connection = mysql.createConnection(config.database);

connection.connect(error => {
    if (error) throw error;
    console.log("Conectado ao banco de dados MySQL!");
});

module.exports = connection;
