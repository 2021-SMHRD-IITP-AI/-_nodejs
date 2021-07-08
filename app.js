const express = require("express");
const app = express();
const router = require("./routes/router.js");
const ejs = require("ejs");

const body = require("body-parser");
app.use(body.urlencoded({extended:true}));

// app.use(body.json());

// app.use(function(req, res, next){
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

const session = require("express-session");
const mysql_session = require("express-mysql-session");

let conn = {
    host : "localhost",
    user : "root",
    password : "1234",
    port : "3306",
    database : "one_project_db"
}

let sessionSave = new mysql_session(conn);

app.use(session({
    secret : "smart_session",
    resave : false,
    saveUninitialized : true,
    store : sessionSave
}));

app.set("view engine", "ejs");

app.use(router);
app.listen(3000);