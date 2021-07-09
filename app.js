const express = require("express");
const app = express();
const router = require("./routes/router.js");
const ejs = require("ejs");

const body = require("body-parser");
app.use(body.urlencoded({extended:true}));

const session = require("express-session");
const mysql_session = require("express-mysql-session");
const { request, response } = require("express");

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

//추가
app.use(express.static('public')); // 1번 미들웨어
app.use((req, res, next) => {
    // 2번 미들웨어
    next();
});
app.get('/', (req, res) => {
    // 3번 미들웨어
    res.status(200).sendFile(__dirname+'/Dorirak.html');
});
// -------------------------------------------------------

app.use(router);
app.listen(3000);