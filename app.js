const express = require("express");
const app = express();
const router = require("./routes/router.js");
const ejs = require("ejs");

const body = require("body-parser");
app.use(body.urlencoded({extended:false}));

app.set("view engine", "ejs");

app.use(router);
app.listen(3000);