const mysql = require("mysql");

const conn = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "1234",
    port : "3306",
    database : "one_project_db"
});

module.exports = conn;