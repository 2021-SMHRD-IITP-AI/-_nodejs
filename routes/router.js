const express = require("express");
const router = express.Router();

const conn = require("../config/DB_config.js");

router.post("/Login", function(request, response){
    let id = request.body.id;
    let pw = request.body.pw;

        conn.connect(); 
    let sql = "select * from members where id = ?";

    conn.query(sql, [id], function(err, row){
        if(row.length > 0){
            if(row[0].pw === pw){
                response.render("loginS", {
                    id : id
                });
            } else{
                response.redirect("http://127.0.0.1:5501/public/LoginF.html");
            }
        } else{
            response.redirect("http://127.0.0.1:5501/public/LoginF.html");
        }
    });
    conn.end();
});

router.post("/Join", function(request, response){
    let id = request.body.id;
    let pw = request.body.pw;
    let name = request.body.name;
    let address = request.body.address;
    let health = request.body.health;
    let tel = request.body.tel;
    let email = request.body.email;
    
    let sql = "insert into members values(?, ?, ?, ?, ?, ?, ?, now())";

    conn.query(sql, [id, pw, name, address, health, tel, email], function(err, row){
        if(!err){
            console.log("입력성공");
            response.redirect("http://127.0.0.1:5501/public/Main.html");
        } else{
            console.log("입력실패"+err);
        }
    });
});

module.exports = router;