const express = require("express");
const router = express.Router();

const conn = require("../config/DB_config.js");

router.post("/Login", function(request, response){
    let id = request.body.id;
    let pw = request.body.pw;

    conn.connect();

    let sql = "select * from members where mem_id = ?";

    conn.query(sql, [id], function(err, row){
        if(row.length > 0){
            if(row[0].mem_pw === pw){
                response.render("loginS", {
                    in_id : id
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
    
    conn.connect();

    let sql = "insert into members values(?, ?, ?, ?, ?, ?, ?, now())";

    conn.query(sql, [id, pw, name, address, health, tel, email], function(err, row){
        if(!err){
            response.redirect("http://127.0.0.1:5501/public/Main.html");
        } else{
            console.log("입력실패"+err);
        }
    });
    conn.end();
});

router.get("/Dise", function(request, response){
    conn.connect();

    let sql = "select * from disease";

    conn.query(sql, function(err, row){
        response.render("dise", {
            in_row : row
        });
    });
    conn.end();
});

router.get("/Select", function(request, response){
    conn.connect();
    
    let sql = "select * from members";

    conn.query(sql, function(err, row){
        response.render("select", {
            in_row : row
        });
    });
    conn.end();
});

module.exports = router;